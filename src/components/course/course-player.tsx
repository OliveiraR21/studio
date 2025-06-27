interface CoursePlayerProps {
  videoUrl: string;
  title: string;
}

export function CoursePlayer({ videoUrl, title }: CoursePlayerProps) {
  return (
    <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden shadow-lg">
      {/* In a real app, this would be a video player component like Plyr or Video.js */}
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white">Player de vídeo para: {title}</p>
      </div>
    </div>
  );
}
