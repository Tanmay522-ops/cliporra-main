"use client"

import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import { MessageCircle, Monitor } from "lucide-react"
import Image from "next/image"

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.08] py-16 pb-8 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-1 col-span-2">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <Image
                                    src="/cliporra-logo.svg"
                                    height={40}
                                    width={40}
                                    alt="logo"
                                />
                            </div>
                            <span className="text-lg font-medium">Cliporra</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
                            Record your screen, share instantly, and let AI handle the rest — transcriptions, summaries, and more.
                        </p>
                        <div className="flex gap-3">
                            {[TwitterLogoIcon, GitHubLogoIcon, MessageCircle, LinkedInLogoIcon].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-muted-foreground hover:border-white/25 transition-colors">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest mb-4">Product</p>
                        <ul className="space-y-2.5">
                            {["Features", "Download", "Changelog", "Pricing"].map(item => (
                                <li key={item}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a></li>
                            ))}
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    AI Tools
                                    <span className="text-[10px] bg-purple-500/15 text-purple-400 border border-purple-400/30 px-1.5 py-0.5 rounded font-medium">New</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest mb-4">Company</p>
                        <ul className="space-y-2.5">
                            {["About", "Blog", "Careers", "Contact"].map(item => (
                                <li key={item}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest mb-4">Legal</p>
                        <ul className="space-y-2.5">
                            {["Privacy policy", "Terms of service", "Cookie policy"].map(item => (
                                <li key={item}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/[0.08] pt-6 flex items-center justify-between flex-wrap gap-4">
                    <p className="text-sm text-muted-foreground/60">© 2025 Cliporra. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground/60">All systems operational</span>
                    </div>
                </div>

            </div>
        </footer>
    )
}