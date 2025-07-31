"use client";

import React, { useEffect, useRef } from 'react';

// Declaração para o TypeScript reconhecer os objetos da API do YouTube na janela (window)
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | null;
  }
}

interface CoursePlayerProps {
  videoUrl: string;
  title: string;
}

export function CoursePlayer({ videoUrl, title }: CoursePlayerProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null); // Referência para o objeto do player do YouTube

  // Função para extrair o ID do vídeo da URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  useEffect(() => {
    // Só executa a lógica para vídeos do YouTube
    if (!videoId || !playerContainerRef.current) return;

    // Se o player já foi criado, não faz nada para evitar duplicação
    if (playerRef.current) return;

    // Função que será chamada pela API do YouTube quando estiver pronta
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: videoId,
        playerVars: {
          rel: 0, // Limita sugestões ao mesmo canal (boa prática manter)
          modestbranding: 1, // Tenta minimizar a marca do YouTube
          controls: 1, // Mostra os controles do player
          iv_load_policy: 3, // Desativa anotações
        },
        events: {
          // Adiciona um "ouvinte" para eventos do player
          'onStateChange': onPlayerStateChange
        }
      });
    };

    // Função que é executada sempre que o estado do player muda (play, pausa, finalizado, etc.)
    function onPlayerStateChange(event: any) {
      // O estado "0" significa que o vídeo terminou (YT.PlayerState.ENDED)
      if (event.data === 0) {
        // Ação: em vez de deixar o ecrã de sugestões aparecer,
        // movemos o vídeo para o segundo 0 e pausamos.
        setTimeout(() => {
          playerRef.current.seekTo(0);
          playerRef.current.pauseVideo();
        }, 50); // Um pequeno atraso para garantir a execução
      }
    }

    // Carrega o script da API do IFrame do YouTube se ele ainda não existir
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else if (window.YT.Player) {
      // Se a API já estiver carregada, apenas cria o player
      window.onYouTubeIframeAPIReady?.();
    }

    // Função de "limpeza" para quando o componente for desmontado
    return () => {
      window.onYouTubeIframeAPIReady = null;
    };

  }, [videoId]); // O useEffect será executado novamente se o videoId mudar

  // Se não for um vídeo do YouTube, usa a lógica antiga de iframe
  if (!videoId) {
    let embedUrl = videoUrl;
    if (videoUrl?.includes("heygen.com/")) {
      embedUrl = videoUrl.replace(/(\/guest)?\/videos?\//, "/embeds/");
    }
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

  // Para vídeos do YouTube, renderiza um 'div' que será substituído pelo player da API
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-900 shadow-lg">
      <div ref={playerContainerRef} className="w-full h-full" />
    </div>
  );
}