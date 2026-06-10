import { SourceDeviceStateProps } from '@/hooks/useMediaSources'
import { useStudioSettings } from '@/hooks/useStudioSettings'
import { Loader } from '../Loader'
import { Headphones, Monitor, Settings2 } from 'lucide-react'

type Props = {
    state: SourceDeviceStateProps
    user:
    | ({
        subscription: {
            plan: 'PRO' | 'FREE'
        } | null
        studio: {
            id: string
            screen: string | null
            mic: string | null
            camera: string | null
            preset: 'HD' | 'SD'
            userId: string | null
        } | null
    } & {
        id: string
        email: string
        firstname: string | null
        lastname: string | null
        createdAt: Date
        clerkid: string
    })
    | null
}

const MediaConfiguration = ({ state, user }: Props) => {
    const activeScreen = state.displays?.find(
        (screen) => screen.id === user?.studio?.screen
    )

    const activeAudio = state.audioInputs?.find(
        (device) => device.deviceId === user?.studio?.mic
    )

    const { isPending, onPreset, register } = useStudioSettings(
        user!.id,
        user?.studio?.screen || state.displays?.[0]?.id,
        user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
        user?.studio?.preset,
        user?.subscription?.plan
    )

    return (
        <form className="flex h-full relative w-full flex-col gap-y-5">
            {isPending && (
                <div className="fixed z-50 w-full top-0 left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center">
                    <Loader />
                </div>
            )}
            <div className="flex gap-x-5 justify-center items-center w-full px-4">
                <Monitor
                    fill="#575655"
                    color="#575655"
                    size={36}
                />
                <div className="relative w-full">
                    <select
                        {...register('screen')}
                        className="w-full appearance-none outline-none cursor-pointer pl-3 pr-8 py-2 rounded-md border border-neutral-700 bg-transparent text-white text-sm focus:border-neutral-500 transition-colors"
                    >
                        {state.displays?.map((display, key) => (
                            <option
                                selected={activeScreen && activeScreen.id === display.id}
                                key={key}
                                value={display.id}
                                className="bg-[#171717] cursor-pointer"
                            >
                                {display.name.length > 20
                                    ? `${display.name.substring(0, 20)}...`
                                    : display.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex gap-x-5 justify-center items-center w-full px-4">
                <Headphones
                    color="#575655"
                    size={36}
                />
                <div className="relative w-full">
                    <select
                        {...register('audio')}
                        className="w-full appearance-none outline-none cursor-pointer pl-3 pr-8 py-2 rounded-md border border-neutral-700 bg-transparent text-white text-sm focus:border-neutral-500 transition-colors"
                    >
                        {state.audioInputs?.map((device, key) => (
                            <option
                                selected={activeAudio && activeAudio.deviceId === device.deviceId}
                                key={key}
                                value={device.deviceId}
                                className="bg-[#171717] cursor-pointer"
                            >
                                {device.label.length > 20
                                    ? `${device.label.substring(0, 20)}...`
                                    : device.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div> 
            <div className="flex gap-x-5 justify-center items-center w-full px-4">
                <Settings2
                    color="#575655"
                    size={36}
                />
                <div className="relative w-full">
                    <select
                        {...register('preset')}
                        className="w-full appearance-none outline-none cursor-pointer pl-3 pr-8 py-2 rounded-md border border-neutral-700 bg-transparent text-white text-sm focus:border-neutral-500 transition-colors"
                    >
                        <option
                            disabled={user?.subscription?.plan === 'FREE'}
                            selected={onPreset === "HD" || user?.studio?.preset === 'HD'}
                            value={'HD'}
                            className="bg-[#171717] cursor-pointer"
                        >
                            1080p{' '}
                            {user?.subscription?.plan === 'FREE' && '(Upgrade to PRO plan)'}
                        </option>
                        <option
                            value={'SD'}
                            selected={onPreset === "SD" || user?.studio?.preset === 'SD'}
                            className="bg-[#171717] cursor-pointer"
                        >
                            720p
                        </option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default MediaConfiguration