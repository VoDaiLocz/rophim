"use client";

import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  onReady?: (art: Artplayer) => void;
}

export const VideoPlayer = ({
  url,
  poster,
  title,
  onReady,
}: VideoPlayerProps) => {
  const artRef = useRef<HTMLDivElement>(null);
  const isEmbed =
    typeof url === "string" &&
    (url.includes("/player/?url=") ||
      url.includes("/embed/") ||
      url.includes("youtube.com") ||
      url.includes("embed"));

  useEffect(() => {
    if (!artRef.current || isEmbed) return;

    let hlsInstance: Hls | null = null;

    const art = new Artplayer({
      container: artRef.current,
      url: url,
      poster: poster,
      volume: 0.7,
      isLive: false,
      muted: false,
      autoplay: true,
      pip: true,
      autoSize: true,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#ffd875",
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      customType: {
        m3u8: function (video: HTMLMediaElement, sourceUrl: string) {
          if (Hls.isSupported()) {
            if (hlsInstance) {
              hlsInstance.destroy();
            }
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
            });
            hls.loadSource(sourceUrl);
            hls.attachMedia(video);
            hlsInstance = hls;
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
          } else {
            art.notice.show = "Định dạng video không được hỗ trợ";
          }
        },
      },
    });

    if (onReady) {
      onReady(art);
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [url, poster, title, onReady, isEmbed]);

  if (isEmbed) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl transition-all duration-300 border border-white/5 ring-1 ring-white/10">
        <iframe
          src={url}
          title={title || "RoPhim Player"}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      ref={artRef}
      className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl transition-all duration-300 border border-white/5 ring-1 ring-white/10"
    />
  );
};
