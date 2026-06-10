import { getMediaSources } from "@/lib/utils"
import { useReducer } from "react"

export type SourceDeviceStateProps = {
    displays?: {
        appIcon: null
        display_id: string
        id: string
        name: string
        thumbnail: unknown[]
    }[]
    audioInputs?: {
        deviceId: string
        kind: string
        label: string
        groupId: string
    }[]
    error?: string | null
    isPending?: boolean
}

type DisplayDeviceActionProps = {
    type: 'GET_DEVICES'
    payload: SourceDeviceStateProps
}

export const useMediaSources = () => {
    const [state, action] = useReducer(
        (state: SourceDeviceStateProps, action: DisplayDeviceActionProps) => {
            switch (action.type) {
                case 'GET_DEVICES':
                    return { ...state, ...action.payload }

                default:
                    return state
            }
        }, {
        displays: [],
        audioInputs: [],
        error: null,
        isPending: false,
    }
    )

    // create a funtion fetchMediaSources and we are going to return the State and FetchMediaSources

    const fetchMediaResources = () => {
        // invoke this action here and fire the specific type we are going to dispatch this action to this reducer 
        action({ type: 'GET_DEVICES', payload: { isPending: true } })
        getMediaSources().then((sources) =>
            action({
                type: 'GET_DEVICES',
                payload: {
                    displays: sources.displays,
                    audioInputs: sources.audio,
                    isPending: false,
                },
            })
        )
    }

    return { state, fetchMediaResources }
}