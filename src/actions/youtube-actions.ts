
'use server';

import { z } from 'zod';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const VideoDetailsSchema = z.object({
  title: z.string(),
  description: z.string(),
  durationInSeconds: z.number(),
  thumbnailUrl: z.string().url(),
  transcript: z.string().optional(),
});

export type YouTubeVideoDetails = z.infer<typeof VideoDetailsSchema>;

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function parseISO8601Duration(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  return (hours * 3600) + (minutes * 60) + seconds;
}


async function getTranscript(videoId: string): Promise<string | undefined> {
    try {
        // This is a simplified, unofficial way to get transcripts.
        // A production app might use a more robust library or service.
        const response = await fetch(`https://youtubetranscript.com/?server_vid=${videoId}`);
        const transcriptData = await response.json();

        if (transcriptData && transcriptData.length > 0) {
            return transcriptData.map((item: {text: string}) => item.text).join(' ');
        }
    } catch (error) {
        console.warn(`Could not fetch transcript for video ${videoId}:`, error);
    }
    return undefined;
}


export async function getYouTubeVideoDetails(
  url: string
): Promise<{ success: true; data: YouTubeVideoDetails } | { success: false; message: string }> {
  if (!YOUTUBE_API_KEY) {
    return { success: false, message: "A chave da API do YouTube não está configurada no servidor." };
  }

  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return { success: false, message: "URL do YouTube inválida ou formato não suportado." };
  }

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        const errorData = await response.json();
        console.error("YouTube API Error:", errorData);
        return { success: false, message: `Erro na API do YouTube: ${errorData.error?.message || response.statusText}` };
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return { success: false, message: "Vídeo não encontrado no YouTube." };
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;

    // Try to get the highest resolution thumbnail available
    const thumbnailUrl = snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url;

    // Fetch transcript in parallel
    const transcript = await getTranscript(videoId);

    const videoDetails: YouTubeVideoDetails = {
      title: snippet.title,
      description: snippet.description,
      durationInSeconds: parseISO8601Duration(contentDetails.duration),
      thumbnailUrl: thumbnailUrl,
      transcript: transcript,
    };
    
    const validatedData = VideoDetailsSchema.safeParse(videoDetails);

    if (!validatedData.success) {
        console.error("Validation error for YouTube data:", validatedData.error);
        return { success: false, message: "Os dados recebidos do YouTube são inválidos." };
    }

    return { success: true, data: validatedData.data };

  } catch (error) {
    console.error("Failed to fetch YouTube video details:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return { success: false, message: `Falha ao buscar detalhes do vídeo: ${errorMessage}` };
  }
}
