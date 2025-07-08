"use client";

interface CoursePlayerProps {
  videoUrl: string;
  title: string;
}

export function CoursePlayer({ videoUrl, title }: CoursePlayerProps) {
  const getEmbedUrl = (url: string): string => {
    if (url && url.includes("heygen.com/")) {
      // Handles both /video/ and /videos/ in the URL
      return url.replace(/\/videos?\//, "/embeds/");
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-900 shadow-lg" title={title}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="border-0"
      ></iframe>
    </div>
  );
}
