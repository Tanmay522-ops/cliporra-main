import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import fs from "fs"
import path from "path"
import { Readable } from "stream"
import axios from "axios"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
dotenv.config()

const app = express()

// ✅ Create temp_upload dir if missing
const tempDir = path.join(process.cwd(), "temp_upload")
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
  console.log("🟢 temp_upload directory created")
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
  region: process.env.BUCKET_REGION!,
})

const httpServer = http.createServer(app)

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}))
app.use(express.json())

// ✅ Health check for Railway
app.get("/health", (_, res) => res.json({ status: "ok" }))

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  transports: ["websocket", "polling"],
})

io.on("connection", (socket) => {
  console.log("🟢 Socket is connected:", socket.id)

  // ✅ Per-socket chunks, never global
  let recordedChunks: Buffer[] = []

  socket.on("start-recording", (data) => {
    console.log("🟢 New recording started, clearing chunks")
    recordedChunks = []
  })

  socket.on("video-chunks", async (data) => {
    console.log("🟢 Video chunk received")
    try {
      const filePath = path.join(tempDir, data.filename)
      const writestream = fs.createWriteStream(filePath)

      // ✅ Handle ArrayBuffer sent from client
      const buffer = Buffer.from(data.chunks)
      recordedChunks.push(buffer)

      const combined = Buffer.concat(recordedChunks)
      const readStream = Readable.from(combined)

      readStream.pipe(writestream).on("finish", () => {
        console.log("🟢 Chunk saved:", data.filename)
      })
    } catch (err) {
      console.log("🔴 Error saving chunk:", err)
    }
  })

  socket.on("ping", () => {
    socket.emit("pong") // ✅ respond to keepalive
  })

  socket.on("process-video", async (data) => {
    console.log("🟢 Processing video:", data.filename)
    recordedChunks = []

    await new Promise(resolve => setTimeout(resolve, 1000))

    const filePath = path.join(tempDir, data.filename)

    fs.readFile(filePath, async (err, file) => {
      if (err) return console.log("🔴 Error reading file:", err)

      try {
        const processing = await axios.post(
          `${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,
          { filename: data.filename }
        )

        if (processing.data.status !== 200)
          return console.log("🔴 Error creating processing record")

        const command = new PutObjectCommand({
          Key: data.filename,
          Bucket: process.env.BUCKET_NAME,
          ContentType: "video/webm",
          Body: file,
        })

        const fileStatus = await s3.send(command)

        if (fileStatus["$metadata"].httpStatusCode === 200) {
          console.log("🟢 Video uploaded to S3")

          try {
            await axios.get(`${process.env.CLOUD_FRONT_STREAM_URL}/${data.filename}`)
            console.log("🟢 CloudFront cache warmed")
          } catch (error: any) {
            console.log("🔴 Cache warm failed:", error.response?.status)
          }

          const stopProcessing = await axios.post(
            `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
            { filename: data.filename }
          )

          if (stopProcessing.status === 200) {
            fs.unlink(filePath, (err) => {
              if (!err) console.log("🟢 Temp file deleted:", data.filename)
            })
          }
        } else {
          console.log("🔴 S3 upload failed")
        }
      } catch (error) {
        console.log("🔴 process-video error:", error)
      }
    })
  })

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", socket.id, "| Reason:", reason)
  })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`🟢 Server is running on port ${PORT}`)
})