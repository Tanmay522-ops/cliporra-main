import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import fs from "fs"
import { Readable } from "stream"
import axios from "axios"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
dotenv.config()

const app = express()

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
  region: process.env.BUCKET_REGION!,
})

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
  recordedChunks = []

  socket.on("video-chunks", async (data) => {
    console.log("🟢 Video chunk is sent")
    const writestream = fs.createWriteStream("temp_upload/" + data.filename)
    recordedChunks.push(new Uint8Array(data.chunks))
    // @ts-ignore
    const videoBlob = new Blob(recordedChunks, { type: "video/webm; codecs=vp9" })
    const buffer = Buffer.from(await videoBlob.arrayBuffer())
    const readStream = Readable.from(buffer)
    readStream.pipe(writestream).on("finish", () => {
      console.log("🟢 Chunk Saved")
    })
  })

  socket.on("start-recording", (data) => {
    console.log("🟢 New recording started, clearing chunks")
    recordedChunks = []
  })

  socket.on("process-video", async (data) => {
    console.log("🟢 Processing video..")
    recordedChunks = []

    await new Promise(resolve => setTimeout(resolve, 1000))

    fs.readFile('temp_upload/' + data.filename, async (err, file) => {
      if (err) return console.log('🔴 Error reading file:', err)

      try {
        const processing = await axios.post(
          `${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,
          { filename: data.filename }
        )

        if (processing.data.status !== 200)
          return console.log('🔴 Error: Something went wrong with creating the processing file')

        const Key = data.filename
        const Bucket = process.env.BUCKET_NAME
        const ContentType = 'video/webm'
        const command = new PutObjectCommand({ Key, Bucket, ContentType, Body: file })

        const fileStatus = await s3.send(command)

        if (fileStatus['$metadata'].httpStatusCode === 200) {
          console.log('🟢 Video Uploaded To AWS')

          try {
            await axios.get(`${process.env.CLOUD_FRONT_STREAM_URL}/${data.filename}`)
            console.log('🟢 CloudFront cache warmed')
          } catch (error: any) {
            console.log('🔴 Cache warm failed:', error.response?.status)
          }

          const stopProcessing = await axios.post(
            `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
            { filename: data.filename }
          )

          if (stopProcessing.data.status !== 200)
            console.log('🔴 Error: Something went wrong when stopping the process')

          if (stopProcessing.status === 200) {
            fs.unlink('temp_upload/' + data.filename, (err) => {
              if (!err) console.log(data.filename + ' 🟢 deleted successfully')
            })
          }
        } else {
          console.log('🔴 Error. Upload Failed! process aborted')
        }
      } catch (error) {
        console.log('🔴 process-video error:', error)
      }
    })
  })

  socket.on("disconnect", () => {
    console.log("🔴 Socket id is disconnected:", socket.id)
  })
})

httpServer.listen(5000, () => {
  console.log("🟢 Server is running on port 5000")
})