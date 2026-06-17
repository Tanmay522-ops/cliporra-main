'use client'
import * as React from 'react';
import { useState } from 'react';
import { Laptop, Grid2x2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DownloadButton from './button-download';


type DownloadStatus = "idle" | "downloading" | "downloaded" | "complete"

const VERSION = 'v1.0.0'
const BASE_URL = `https://github.com/Tanmay522-ops/cliporra-main/releases/download/${VERSION}`

const DOWNLOAD_LINKS = {
    windows: `${BASE_URL}/Cliporra-Setup-1.0.0.exe`,
    mac: `${BASE_URL}/Cliporra-1.0.0.dmg`,
    linux: `${BASE_URL}/Cliporra-1.0.0.AppImage`,
}

interface CardButton {
    text: string;
    icon?: React.ReactNode;
    downloadKey?: 'windows' | 'mac' | 'linux'
    variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'link';
    onClick?: () => void;
}

interface DownloadCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    buttons: CardButton[];
}

const CardDownloadButton = ({ button }: { button: CardButton }) => {
    const [status, setStatus] = useState<DownloadStatus>("idle")
    const [progress, setProgress] = useState(0)

    const triggerDownload = () => {
        if (!button.downloadKey || status !== "idle") return
        setStatus("downloading")
        setProgress(0)

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) { clearInterval(interval); return 100 }
                return prev + 5
            })
        }, 200)

        const link = document.createElement('a')
        link.href = DOWNLOAD_LINKS[button.downloadKey]
        link.setAttribute('download', '')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setTimeout(() => setStatus("downloaded"), 4000)
        setTimeout(() => {
            setStatus("complete")
            setTimeout(() => { setStatus("idle"); setProgress(0) }, 100)
        }, 5500)
    }

    if (!button.downloadKey) {
        return (
            <Button
                variant={button.variant || 'secondary'}
                className="w-full"
                onClick={button.onClick}
            >
                {button.icon && <span className="mr-2">{button.icon}</span>}
                {button.text}
            </Button>
        )
    }

    return (
        <DownloadButton
            downloadStatus={status}
            progress={progress}
            onClick={triggerDownload}
            className="w-full"
            label={
                <span className="flex items-center gap-2">
                    {button.icon}
                    {button.text}
                </span>
            }
        />
    )
}

const DownloadCard: React.FC<DownloadCardProps> = ({
    title,
    description,
    icon,
    buttons,
}) => {
    return (
        <div className="
            group flex flex-col items-center gap-4
            rounded-xl border border-border bg-card
            p-5 transition-all duration-300
            hover:border-primary/40 hover:shadow-md hover:shadow-primary/10
        ">
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {icon}
            </div>

            {/* Text */}
            <div className="flex flex-col items-center text-center gap-1">
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-col gap-2 mt-1">
                {buttons.map((button, index) => (
                    <CardDownloadButton key={index} button={button} />
                ))}
            </div>
        </div>
    );
};

export const DownloadShowcase = () => {
    const downloadOptions: DownloadCardProps[] = [
        {
            title: 'Desktop App',
            description: 'Record your screen on Mac or Windows',
            icon: <Laptop className="h-6 w-6" />,
            buttons: [
                {
                    text: 'Download on Mac',
                    icon: <Laptop className="h-4 w-4 " />,
                    downloadKey: 'mac'
                },
                {
                    text: 'Download on Windows',
                    icon: <Grid2x2 className="h-4 w-4" />,
                    downloadKey: 'windows'
                },
            ],
        },
        {
            title: 'Linux App',
            description: 'Full recording experience on Linux',
            icon: <Terminal className="h-6 w-6" />,
            buttons: [
                {
                    text: 'Download on Linux',
                    icon: <Terminal className="h-4 w-4" />,
                    downloadKey: 'linux'
                },
            ],
        },
        {
            title: 'Mobile App',
            description: 'Coming soon on iOS & Android',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            buttons: [
                {
                    text: 'Join the waitlist',
                    variant: 'secondary'
                }
            ],
        },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 bg-background">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
                    Use Cliporra Anywhere You Record
                </h2>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Download the app for your platform and start recording instantly
                </p>
            </div>

            {/* Cards — compact and centered */}
            <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
                {downloadOptions.map((card, index) => (
                    <DownloadCard key={index} {...card} />
                ))}
            </div>

            {/* Continue */}
            <Button
                size="lg"
                className="mt-10 w-full max-w-xs rounded-full cursor-pointer"
                onClick={() => window.history.back()}
            >
                Continue
            </Button>
        </div>
    );
};