"use client"
import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import NavBar from "./(landing)/_components/navbar";
import { navItems } from "./(landing)/_components/data/data";
import { HeroSection } from "./(landing)/_components/Hero-Section/hero-section";
import CtaSection from "./(landing)/_components/Cta-section/cta-section";
import CardSection from "./(landing)/_components/card-section/card-section";
import { BlogSection } from "./(landing)/_components/Blog-section/blog-section";
import FooterSection from "./(landing)/_components/Footer-Section/footer-section";

export default function SpotlightPreview() {
    return (
        <div className="relative flex w-full min-h-screen flex-col bg-black antialiased">

            {/* Grid — fixed so it covers the entire page always */}
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 select-none z-0",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
                )}
            />

            {/* Spotlight */}
            <Spotlight
                className="-top-40 left-0 md:-top-20 md:left-60 z-10"
                fill="white"
            />

            {/* Content — z-10 so it sits above grid, bg-transparent so grid shows through */}
            <div className="relative z-10 flex flex-col">
                <NavBar items={navItems} />
                <HeroSection />
                <CtaSection />
                <CardSection />
                <BlogSection/>
                <FooterSection/>
            </div>

        </div>
    );
}