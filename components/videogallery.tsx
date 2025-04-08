"use client";
import React, { useState, useEffect } from "react";
import { Search, Clock, Play, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MeditationVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  duration: string;
}

interface VideoGalleryProps {
  videos: MeditationVideo[];
  isLoading?: boolean;
  error?: string | null;
  onVideoSelect: (video: MeditationVideo) => void;
  onSearch?: (query: string) => Promise<void>;
  className?: string;
}

export function VideoGallery({
  videos = [],
  isLoading = false,
  error = null,
  onVideoSelect = () => {},
  onSearch = async () => {},
  className,
}: VideoGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      await onSearch(searchQuery);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      data-component="VideoGallery"
      className={cn("w-full space-y-6", className)}
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search meditation videos..."
            className="pl-10 pr-20 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading || isSearching}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1 h-8"
            disabled={isLoading || isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

      {isLoading || isSearching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-40" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="w-full h-5" />
                  <Skeleton className="w-2/3 h-4" />
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0">
                  <Skeleton className="w-full h-9" />
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg">
          <p className="text-destructive mb-2">{error}</p>
          <Button onClick={() => onSearch("")} variant="outline">
            Try Again
          </Button>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No videos found</h3>
          <p className="text-muted-foreground mb-4">
            Try searching for different meditation videos.
          </p>
          <Button
            onClick={() => onSearch("guided meditation")}
            variant="outline"
          >
            Browse Guided Meditations
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <Card
              key={video.videoId}
              className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
              onClick={() => onVideoSelect(video)}
            >
              <div className="relative group">
                <div className="w-full aspect-video bg-muted overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <Badge
                  variant="secondary"
                  className="absolute bottom-2 right-2 bg-black/70 text-white border-none"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </Badge>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVideoSelect(video);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play Now
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3
                  className="font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors"
                  title={video.title}
                >
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {video.channelName}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
