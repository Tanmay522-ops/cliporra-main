import LandingPageNavbar from "./(landing)/_components/navbar";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


export default  async function LandingPage() {
    const user = await currentUser()

    if (user) redirect('/callback')
    return (
    <div className="flex flex-col py-10 px-10 xl:px-0 container">
             <LandingPageNavbar />
    </div>
    )
}