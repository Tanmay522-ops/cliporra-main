import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import fs from "fs"
import { Readable } from "stream"
import axios from "axios"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import path from "path"
dotenv.config()

const app = express()

const tempDir = path.join(process.cwd(), "temp_upload")
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}


// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_KEY
// })

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
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
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

  socket.on("ping", () => {
    socket.emit("pong")
  })

  socket.on("process-video", async (data) => {
    console.log("🟢 Processing video..")
    console.log("🟢 data received:", data.userId, data.filename) 
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

          // if (processing.data.plan === 'PRO') {
          //   fs.stat('temp_upload/' + data.filename, async (err, stat) => {
          //     if (!err) {
          //       if (stat.size < 25000000) {
          //         const transcription = await openai.audio.transcriptions.create({
          //           file: fs.createReadStream(`temp_upload/${data.filename}`),
          //           model: 'whisper-1',
          //           response_format: 'text',
          //         })

          //         if (transcription) {
          //           const completion = await openai.chat.completions.create({
          //             model: 'gpt-3.5-turbo',
          //             response_format: { type: 'json_object' },
          //             messages: [
          //               {
          //                 role: 'system',
          //                 content: `You are going to generate a title and a nice description using the speech to text transcription provided: transcription(${transcription}) and then return it in json format as {"title": <the title you gave>, "summary": <the summary you created>}`,
          //               },
          //             ],
          //           })

          //           const titleAndSummaryGenerated = await axios.post(
          //             `${process.env.NEXT_API_HOST}recording/${data.userId}/transcribe`,
          //             {
          //               filename: data.filename,
          //               content: completion.choices[0].message.content,
          //               transcript: transcription,
          //             }
          //           )

          //           if (titleAndSummaryGenerated.data.status !== 200) {
          //             console.log('🔴 Error: Something went wrong when creating the title and description')
          //           }
          //         }
          //       }
          //     }
          //   })
          // }

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

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🟢 Server is running on port ${PORT}`)
})
