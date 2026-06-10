import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const httpClient = axios.create({
  baseURL:import.meta.env.VITE_HOST_URL
})

// when user click on closeApp we are firing an IPCRender name as closeApp then inside our main.tsx file
//  when we start our entire application we are going to setup the listener for this event
// we are sending something from here so probably we are listening it from  somewhere else in the file 
export const onCloseApp = () =>  window.ipcRenderer.send('closeApp')

export const fetchUserProfile = async(clerkId:string)=>{

  const response = await httpClient.get(`/auth/${clerkId}`,{
    headers:{
      "Content-Type":"application/json",
    },
  })
  return response.data

}



export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke('getSources')
  const enumerateDevices = await window.navigator.mediaDevices.enumerateDevices()
  const audioIputs = enumerateDevices.filter(
    (device) => device.kind === 'audioinput'
  )

  console.log('getting sources')
  return { displays, audio: audioIputs }
}



export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: 'HD' | 'SD'
) => {
  const response = await httpClient.post(
    `/studio/${id}`,
    {
      screen,
      audio,
      preset,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data
}


export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send('hide-plugin', { state })
}



export const videoRecordingTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, '0')
  const minute = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, '0')
  const hour = Math.floor(ms / 1000 / 60 / 60)
    .toString()
    .padStart(2, '0')

  return { length: `${hour}:${minute}:${second}`, minute }
}


export const resizeWindow = (shrink: boolean) => {
  window.ipcRenderer.send('resize-studio', { shrink })
}