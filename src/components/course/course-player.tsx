interface CoursePlayerProps {
  videoUrl: string;
  title: string;
}

export function CoursePlayer({ videoUrl, title }: CoursePlayerProps) {
  return (
    <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden shadow-lg">
      <iframe
        className="w-full h-full"
        src={videoUrl}
        title={`Player de vídeo para: ${title}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}
