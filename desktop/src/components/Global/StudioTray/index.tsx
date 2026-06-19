import { onStopRecording, selectSources, StartRecording } from '@/lib/recorder'
import { cn,  videoRecordingTime } from '@/lib/utils'
import { Cast, Pause, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const StudioTray = () => {

    const initialTime = new Date()
    const [recording, setRecording] = useState(false)
    const[onTimer,setOnTimer] = useState<string>('00:00:00')
    const[count,setCount] =  useState(0)
    const [preview, setPreview] = useState(false)
    const [onSources, setOnSources] = useState<
        | {
            screen: string
            id: string
            audio: string
            preset: 'HD' | 'SD'
            plan: 'PRO' | 'FREE'
        }
        | undefined
    >(undefined)

    const clearTime = ()=>{
        setOnTimer('00:00:00')
        setCount(0)
    }

    useEffect(() => {
        const handler = (_event: Electron.IpcRendererEvent, payload: any) => {
            setOnSources(payload)
        }
        window.ipcRenderer.on('profile-received', handler)
        return () => {
            window.ipcRenderer.off('profile-received', handler)
        }
    }, [])

    const videoElement = useRef<HTMLVideoElement>(null!)


    useEffect(() => {
        if (onSources && onSources.screen) { // remove preview condition
            selectSources(onSources, videoElement)
        }
    }, [onSources])

    useEffect(() => {
        if (!recording) return
        const recordTimeInterval = setInterval(() => {
            const time = count + (new Date().getTime() - initialTime.getTime())
            setCount(time)
            const recordingTime = videoRecordingTime(time)
            if (onSources?.plan === 'FREE' && recordingTime.minute == '05') {
                setRecording(false)
                clearTime()
                onStopRecording()
            }
            setOnTimer(recordingTime.length)
            if(time <=0){
                setOnTimer('00:00:00')
                clearInterval(recordTimeInterval)
            }
        },1)

        return ()=> clearInterval(recordTimeInterval)

    }, [recording])

    return !onSources ? (
        <></>
    ) : (
        <div className="flex flex-col justify-end gap-y-5 h-screen">
            {preview && (
                    <video
                        autoPlay
                        ref={videoElement}
                        className={cn('w-6/12 border-2 self-end bg-white')}
                    ></video>
            )}
            <div className="rounded-full flex justify-around items-center h-16 w-full border-2 bg-[#171717] draggable border-white/40">
                    <div
                        {...(onSources && {
                            onClick: () => {
                                setRecording(true)
                                StartRecording(onSources)
                            },
                        })}
                        className="non-draggable flex items-center gap-x-2 cursor-pointer hover:opacity-80"
                    >
                        <div
                            className={cn(
                                'rounded-full flex-shrink-0',
                                recording ? 'bg-red-500 w-6 h-6' : 'bg-red-400 w-8 h-8'
                            )}
                        />
                        {recording && (
                            <span className="text-white text-sm">{onTimer}</span>
                        )}
                    </div>

                    {!recording ? (
                        <Pause
                            className="non-draggable opacity-50"
                            size={30}
                            fill="white"
                            stroke="none"
                        />
                    ) : (
                        <Square
                            size={30}
                            className="non-draggable cursor-pointer hover:scale-110 transform transition duration-150"
                            fill="white"
                            onClick={() => {
                                setRecording(false)
                                clearTime()
                                onStopRecording()
                            }}
                            stroke="white"
                        />
                    )}

                    <Cast
                        onClick={() => setPreview((prev) => !prev)}
                        size={30}
                        fill="white"
                        className="non-draggable cursor-pointer hover:opacity-60"
                        stroke="white"
                    />

                </div>
            </div>
    )

}

export default StudioTray