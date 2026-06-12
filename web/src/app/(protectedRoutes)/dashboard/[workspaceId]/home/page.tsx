import { getWixContent } from '@/actions/workspace'
import VideoCard from '@/components/global/videos/Video-Card'

import React from 'react'

type Props = {}

const Home = async (props: Props) => {
    const videos = await getWixContent()

    console.log(videos)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {videos.status === 200
                ? videos.data?.map((video) => (
                    <VideoCard
                        key={video.id}
                        {...video}
                        workspaceId={video.workspaceId!}
                    />
                ))
                : ''}
        </div>
    )
}

export default Home