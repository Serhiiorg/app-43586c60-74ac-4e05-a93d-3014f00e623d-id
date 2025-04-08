"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
}

export function VideoPlayer({
  videoId,
  title = "Meditation Video",
  autoplay = false,
  className,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Reset loading state when video ID changes
    setIsLoading(true);
    setError(null);
  }, [videoId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load the video. Please try again later.");
  };

  const togglePlay = () => {
    if (!iframeRef.current) return;

    try {
      const message = isPlaying
        ? JSON.stringify({ event: "command", func: "pauseVideo" })
        : JSON.stringify({ event: "command", func: "playVideo" });

      iframeRef.current.contentWindow?.postMessage(message, "*");
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error("Failed to control video playback", err);
    }
  };

  const toggleMute = () => {
    if (!iframeRef.current) return;

    try {
      const message = isMuted
        ? JSON.stringify({ event: "command", func: "unMute" })
        : JSON.stringify({ event: "command", func: "mute" });

      iframeRef.current.contentWindow?.postMessage(message, "*");
      setIsMuted(!isMuted);
    } catch (err) {
      console.error("Failed to control video volume", err);
    }
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;

    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        iframeRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error("Failed to toggle fullscreen", err);
    }
  };

  // Generate YouTube embed URL with appropriate parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${
    autoplay ? 1 : 0
  }&modestbranding=1&rel=0&showinfo=0`;

  return (
    <Card
      data-component="VideoPlayer"
      className={cn("overflow-hidden", className)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col">
          {title && (
            <div className="px-4 py-3 border-b">
              <h3 className="text-lg font-medium truncate" title={title}>
                {title}
              </h3>
            </div>
          )}

          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Loader className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center p-4">
                  <p className="text-destructive mb-2">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsLoading(true);
                      setError(null);
                      if (iframeRef.current) {
                        iframeRef.current.src = embedUrl;
                      }
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
              title={title}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              aria-label={`YouTube video player for ${title}`}
            />
          </div>

          <div className="p-2 flex items-center justify-between bg-card">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
