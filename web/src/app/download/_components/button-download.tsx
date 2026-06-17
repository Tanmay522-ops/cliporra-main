"use client"
import { Download, Loader2, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

interface DownloadButtonProps {
    downloadStatus: "idle" | "downloading" | "downloaded" | "complete"
    progress: number
    onClick: () => void
    className?: string
    label?: React.ReactNode
}

export default function DownloadButton({
    downloadStatus,
    progress,
    onClick,
    className,
    label
}: DownloadButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={downloadStatus !== "idle"}
            className={cn(
                // Base styles
                "relative w-full overflow-hidden select-none",
                "flex items-center justify-center gap-2",
                "rounded-lg px-4 py-2.5 text-sm font-medium",
                "transition-all duration-200",
                // Border & background
                "border border-border bg-secondary text-secondary-foreground",
                "hover:bg-secondary/80 hover:border-primary/40",
                // Active press effect
                "active:scale-[0.98]",
                // Disabled state
                downloadStatus !== "idle" && "cursor-not-allowed opacity-90",
                // Downloading state
                downloadStatus === "downloading" && "border-primary/50",
                // Downloaded state
                downloadStatus === "downloaded" && "border-green-500/50 bg-green-500/10 text-green-400",
                className,
            )}
        >
            {/* Idle state */}
            {downloadStatus === "idle" && (
                <span className="relative z-10 flex items-center gap-2">
                    {label || (
                        <>
                            <Download className="h-4 w-4" />
                            Download
                        </>
                    )}
                </span>
            )}

            {/* Downloading state */}
            {downloadStatus === "downloading" && (
                <span className="relative z-10 flex items-center gap-2 text-primary-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{progress}%</span>
                </span>
            )}

            {/* Downloaded state */}
            {downloadStatus === "downloaded" && (
                <span className="relative z-10 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Downloaded!</span>
                </span>
            )}

            {/* Complete state - back to idle label */}
            {downloadStatus === "complete" && (
                <span className="relative z-10 flex items-center gap-2">
                    {label || (
                        <>
                            <Download className="h-4 w-4" />
                            Download
                        </>
                    )}
                </span>
            )}

            {/* Progress bar fill */}
            {downloadStatus === "downloading" && (
                <div
                    className="absolute inset-0 left-0 bg-primary transition-all duration-200 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            )}
        </button>
    )
}