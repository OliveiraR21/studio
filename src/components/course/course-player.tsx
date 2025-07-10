"use client";

interface CoursePlayerProps {
  videoUrl: string;
  title: string;
}

export function CoursePlayer({ videoUrl, title }: CoursePlayerProps) {
  const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
      const videoIdMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }
    }

    // Handle HeyGen URLs
    if (url.includes("heygen.com/")) {
      // Handles /videos/, /video/, and /guest/videos/ formats, converting them to the correct /embeds/ format.
      return url.replace(/(\/guest)?\/videos?\//, "/embeds/");
    }
    
    // Return the URL as is if it's not a recognized format that needs conversion
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
