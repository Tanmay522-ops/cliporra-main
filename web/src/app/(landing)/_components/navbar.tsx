"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Download, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { Button } from "@/components/ui/button"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export default function NavBar({ items, className }: NavBarProps) {
    const [activeTab, setActiveTab] = useState(items[0].name)

    return (
        <div
            className={cn(
                "fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50",
                "w-[calc(100%-1.5rem)] sm:w-auto max-w-fit",
                className,
            )}
        >
            <div className="flex items-center justify-center gap-1 sm:gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg overflow-x-auto">

                {/* Nav Items */}
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "relative cursor-pointer text-sm font-semibold px-3 sm:px-6 py-2 rounded-full transition-colors shrink-0",
                                "text-foreground/80 hover:text-primary",
                                isActive && "bg-muted text-primary",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    )
                })}

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-1 shrink-0" />

                {/* Login Button */}
                <Link href="/sign-in" className="shrink-0">
                    <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="bg-black dark:bg-black text-white flex items-center gap-x-2 text-sm px-3 sm:px-4 py-1 cursor-pointer whitespace-nowrap"
                    >
                        Login
                    </HoverBorderGradient>
                </Link>

                {/* Download Button */}
                <Link href="/download" className="shrink-0">
                    <Button className="flex items-center gap-2 cursor-pointer whitespace-nowrap px-3 sm:px-4">
                        <Download className="w-5 h-5" />
                        <span className="hidden sm:inline">Download Cliporra</span>
                    </Button>
                </Link>
            </div>
        </div>
    )
}