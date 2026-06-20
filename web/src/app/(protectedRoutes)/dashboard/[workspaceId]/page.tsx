import CreateFolders from '@/components/global/create-folders'
import CreateWorkspace from '@/components/global/create-workspace'
import Folders from '@/components/global/folders'
import Videos from '@/components/global/videos'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import React from 'react'

type Props = {
  params: Promise<{ workspaceId: string }>
}

const Page = async ({ params }: Props) => {
  const { workspaceId } = await params
  return (
    <div>
      <Tabs
        defaultValue="videos"
        className="mt-6 w-full"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
          <TabsList className="bg-transparent gap-2 pl-0 overflow-x-auto">
            <TabsTrigger
              className="p-2.5 sm:p-[13px] px-4 sm:px-6 text-sm sm:text-base rounded-full data-[state=active]:bg-[#252525] shrink-0"
              value="videos"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="p-2.5 sm:p-[13px] px-4 sm:px-6 text-sm sm:text-base rounded-full data-[state=active]:bg-[#252525] shrink-0"
            >
              Archive
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-x-2 sm:gap-x-3 justify-end sm:justify-normal">
            <CreateWorkspace />
            <CreateFolders workspaceId={workspaceId} />
          </div>
        </div>
        <section className="py-6 sm:py-9">
          <TabsContent value="videos">
            <Folders workspaceId={workspaceId} />
            <Videos workspaceId={workspaceId} videosKey="workspace-videos" />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default Page