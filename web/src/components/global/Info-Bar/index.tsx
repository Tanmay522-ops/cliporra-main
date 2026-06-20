import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Upload as UploadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserButton } from "@clerk/nextjs"
import { RecordIcon } from "@/icons/VideoRecorderIcon"

type Props = {}

const InfoBar = (props: Props) => {
    return (
        <header className="pl-20 md:pl-[265px] fixed top-0 inset-x-0 z-40 p-4 flex items-center justify-between gap-2 sm:gap-4 pointer-events-none">
            <div className="flex gap-2 sm:gap-4 justify-center items-center border-2 rounded-full px-3 sm:px-4 w-full max-w-lg min-w-0 pointer-events-auto">
                <Search
                    className="text-[#707070] shrink-0 w-5 h-5 sm:w-[25px] sm:h-[25px]"
                />
                <Input
                    className="bg-transparent border-none !placeholder-neutral-500 min-w-0 text-sm sm:text-base"
                    placeholder="Search people, projects, tags & folders"
                />
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 pointer-events-auto">
                <Button className="bg-[#9D9D9D] flex items-center gap-2 px-3 sm:px-4">
                    <UploadIcon size={20} className="shrink-0" />
                    <span className="hidden sm:inline">Upload</span>
                </Button>
                <Button className="bg-[#9D9D9D] flex items-center gap-2 px-3 sm:px-4">
                    <RecordIcon />
                    <span className="hidden sm:inline">Record</span>
                </Button>
                <UserButton />
            </div>
        </header>
    )
}

export default InfoBar