import { Blog7 } from "./_components/blog";

const demoData = {
    tagline: "From the Team",
    heading: "Cliporra Blog",
    description:
        "Stay up to date with the latest product updates, tips for better screen recording, and how teams are using Cliporra to communicate faster and smarter.",
    buttonText: "Explore all posts",
    buttonUrl: "/blog",
    posts: [
        {
            id: "post-1",
            title: "How AI transcription is changing the way teams communicate",
            summary:
                "Manually writing meeting notes is a thing of the past. See how Cliporra's AI-powered transcription instantly converts your recordings into searchable, shareable summaries.",
            label: "AI & Productivity",
            author: "Cliporra Team",
            published: "10 May 2025",
            url: "/blog/ai-transcription-teams",
            image: "/image-14.png",
        },
        {
            id: "post-2",
            title: "5 ways to use screen recording to supercharge async workflows",
            summary:
                "Skip the back-and-forth messages. Learn how async video updates with Cliporra help remote teams stay aligned without scheduling another meeting.",
            label: "Remote Work",
            author: "Cliporra Team",
            published: "28 Apr 2025",
            url: "/blog/async-screen-recording-workflows",
            image: "/image-15.png",
        },
        {
            id: "post-3",
            title: "Introducing workspaces: organize and share videos with your team",
            summary:
                "We just shipped workspaces — a smarter way to organize your recordings into folders, invite collaborators, and keep your team's video library tidy and accessible.",
            label: "Product Update",
            author: "Cliporra Team",
            published: "15 Apr 2025",
            url: "/blog/workspaces-launch",
            image: "/image-16.png",
        },
    ],
};

function BlogSection() {
    return <Blog7 {...demoData} />;
}

export { BlogSection };