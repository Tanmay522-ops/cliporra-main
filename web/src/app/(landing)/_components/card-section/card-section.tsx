import { FeatureShowcase, TabMedia } from "./_components/feature-showcase";

export default function CardSection() {
    const tabs: TabMedia[] = [
        {
            value: "recording",
            label: "Recording",
            src: "/image-11.png",
            alt: "Screen recording in action",
        },
        {
            value: "transcription",
            label: "Transcription",
            src: "/image-12.webp",
            alt: "AI transcription and summary view",
        },
        {
            value: "workspace",
            label: "Workspace",
            src: "/image-13.png",
            alt: "Video sharing workspace",
        },
    ];

    return (
        <FeatureShowcase
            eyebrow="Everything you need"
            title="Record, transcribe, and share — effortlessly"
            description="Cliporra brings together powerful screen recording, AI-powered transcriptions, and collaborative workspaces — so your team can capture ideas and share them instantly."
            stats={["AI summaries", "Instant sharing", "Team workspaces"]}
            steps={[
                {
                    id: "step-1",
                    title: "Capture your screen",
                    text: "Record your screen, webcam, or both with one click. No setup friction — just hit record and Cliporra handles the rest.",
                },
                {
                    id: "step-2",
                    title: "Get AI-powered insights",
                    text: "Cliporra automatically transcribes your recording and generates a smart title and summary using AI — so nothing gets lost.",
                },
                {
                    id: "step-3",
                    title: "Share with your team",
                    text: "Organize videos into workspaces and folders, invite collaborators, and share links instantly — all from one place.",
                },
            ]}
            tabs={tabs}
            defaultTab="transcription"
            panelMinHeight={720}
        />
    );
}