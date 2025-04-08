import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

// Define types for YouTube API responses
interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  nextPageToken?: string;
}

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

interface YouTubeVideoResponse {
  items: YouTubeVideoItem[];
}

interface YouTubeVideoItem {
  id: string;
  contentDetails: {
    duration: string;
  };
}

interface MeditationVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  duration: string;
}

// Cache the fetch function to minimize API calls
const fetchYouTubeVideos = cache(
  async (searchTerm: string): Promise<MeditationVideo[]> => {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;

      if (!apiKey) {
        throw new Error("YouTube API key is not configured");
      }

      // Search for videos
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
        searchTerm,
      )}&type=video&key=${apiKey}`;

      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        throw new Error(
          `YouTube search API error: ${searchResponse.statusText}`,
        );
      }

      const searchData: YouTubeSearchResponse = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      // Get video IDs for fetching duration
      const videoIds = searchData.items
        .map((item) => item.id.videoId)
        .join(",");

      // Get video details including duration
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`;

      const videoResponse = await fetch(videoUrl);

      if (!videoResponse.ok) {
        throw new Error(`YouTube video API error: ${videoResponse.statusText}`);
      }

      const videoData: YouTubeVideoResponse = await videoResponse.json();

      // Format the response
      return searchData.items.map((item, index) => {
        const videoDetails = videoData.items[index];

        return {
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.medium.url,
          channelName: item.snippet.channelTitle,
          duration: formatDuration(
            videoDetails?.contentDetails?.duration || "PT0M0S",
          ),
        };
      });
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      throw error;
    }
  },
);

// Format ISO 8601 duration to human-readable format
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) {
    return "0:00";
  }

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("q") || "meditation";

    // Add 'meditation' to the search term if it doesn't already contain it
    const finalSearchTerm = searchTerm.toLowerCase().includes("meditation")
      ? searchTerm
      : `${searchTerm} meditation`;

    const videos = await fetchYouTubeVideos(finalSearchTerm);

    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch meditation videos: ${error}` },
      { status: 500 },
    );
  }
}
