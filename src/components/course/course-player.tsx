"use client";

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Skeleton } from '@/components/ui/skeleton';

interface CoursePlayerProps {
  videoUrl: string;
  title: string;
}

export function CoursePlayer({ videoUrl, title }: CoursePlayerProps) {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden shadow-lg" title={title}>
      {hasWindow ? (
        <ReactPlayer
          url={videoUrl}
          controls={true}
          width="100%"
          height="100%"
          light={false}
          playing={false}
        />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
}
