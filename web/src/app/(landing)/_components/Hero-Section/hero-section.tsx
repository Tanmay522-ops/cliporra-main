'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useScroll, motion } from 'motion/react'
import { InfiniteSlider } from './_components/infinite-slider'
import { ProgressiveBlur } from './_components/progressive-blur'


export function HeroSection() {
    return (
        <>
            <main className="overflow-x-hidden">
                <section>
                    <div className="relative min-h-[700px] sm:min-h-[850px] lg:min-h-[1050px] py-24 lg:pt-72">
                        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl">Welcome to Cliporra Clip Smarter</h1>
                                <p className="mt-8 max-w-2xl text-balance text-lg">Highly customizable components for building modern websites and applications you mean it.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full pl-5 pr-3 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">Get Started</span>
                                            <ChevronRight className="ml-1" />
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5">
                                        <Link href="#link">
                                            <span className="text-nowrap">Request a demo</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
                                src="/clipora-video.mp4"></video>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}

