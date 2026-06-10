import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import fs from "fs"
import { Readable } from "stream"

dotenv.config()

const app = express()
const httpServer = http.createServer(app)

app.use(cors())
app.use(express.json())

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ELECTRON_HOST,
    methods: ["GET", "POST"],
  },
})

let recordedChunks: Uint8Array[] = []

io.on("connection", (socket) => {
  console.log("🟢 Socket is connected:", socket.id)

  socket.on("video-chunks", async (data) => {
    console.log("🟢 Video chunk is sent")

    const writestream = fs.createWriteStream("temp_upload/" + data.filename)
    recordedChunks.push(new Uint8Array(data.chunks))
    // @ts-ignore
    const videoBlob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    })
    const buffer = Buffer.from(await videoBlob.arrayBuffer())
    const readStream = Readable.from(buffer)
    readStream.pipe(writestream).on("finish", () => {
      console.log("🟢 Chunk Saved")
    })
  })

  socket.on("process-video", async (data) => {
    console.log("🟢 Processing video..")
  })

  socket.on("disconnect", () => {
    console.log("🔴 Socket id is disconnected:", socket.id)
  })
})

httpServer.listen(5000, () => {
  console.log("🟢 Server is running on port 5000")
})