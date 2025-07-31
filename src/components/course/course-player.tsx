
"use client";

interface CoursePlayerProps {
  videoUrl: string;
  title: string;
}

export function CoursePlayer({ videoUrl, title }: CoursePlayerProps) {
  const getEmbedUrl = (url: string): string => {
    if (!url) return '';

    // Verifica se a URL é do YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Expressão regular para extrair o ID do vídeo de diferentes formatos de URL
      const videoIdMatch = url.match(/(?:v=|vi\/|embed\/|youtu.be\/)([a-zA-Z0-9_-]{11})/);

      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];

        // Parâmetros para personalizar o player do YouTube
        const params = new URLSearchParams({
          rel: '0',             // Não mostra vídeos relacionados no final.
          modestbranding: '1',  // Remove o logo do YouTube da barra de controle.
          iv_load_policy: '3',  // Desativa anotações no vídeo.
          controls: '1',        // Garante que os controles do player (play, volume, etc.) sejam exibidos.
        });

        // Retorna a URL de incorporação (embed) padrão e mais limpa
        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      }
    }

    // Mantém a lógica para URLs do HeyGen
    if (url.includes("heygen.com/")) {
      return url.replace(/(\/guest)?\/videos?\//, "/embeds/");
    }

    // Retorna a URL original se não for um formato reconhecido para conversão
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
        // É uma boa prática adicionar o título ao iframe para acessibilidade
        title={title}
      ></iframe>
    </div>
  );
}
