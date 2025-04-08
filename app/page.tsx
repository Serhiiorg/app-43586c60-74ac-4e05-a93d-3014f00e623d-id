"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Play, Plus, Heart, Info, Clock, Search } from "lucide-react";
import { VideoGallery } from "@/components/videogallery";
import { SessionCard } from "@/components/sessioncard";
import { VideoPlayer } from "@/components/videoplayer";
import { ScheduleSession } from "@/components/schedulesession";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MeditationVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  duration: string;
}

interface MeditationSession {
  id: string;
  name: string;
  date: Date;
  time: string;
  duration: string;
  notes?: string;
  videoId?: string;
}

export default function Home() {
  const [videos, setVideos] = useState<MeditationVideo[]>([]);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<MeditationVideo | null>(
    null,
  );
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  // Sample sessions data - in a real app, this would come from a database
  useEffect(() => {
    setSessions([
      {
        id: "1",
        name: "Morning Mindfulness",
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        time: "07:30",
        duration: "15",
        notes: "Focus on breath awareness and setting intentions for the day",
      },
      {
        id: "2",
        name: "Evening Relaxation",
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        time: "20:00",
        duration: "20",
        notes: "Deep relaxation to prepare for restful sleep",
        videoId: "aEqNQn3xHWo",
      },
    ]);
  }, []);

  // Fetch meditation videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/youtube?q=guided+meditation");

        if (!response.ok) {
          throw new Error("Failed to fetch meditation videos");
        }

        const data = await response.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("We couldn't load meditation videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/youtube?q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meditation videos");
      }

      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Error searching videos:", err);
      setError("We couldn't load meditation videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video: MeditationVideo) => {
    setSelectedVideo(video);
  };

  const handleScheduleSession = async (data: any) => {
    // In a real app, this would send data to a backend
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newSession: MeditationSession = {
          id: Date.now().toString(),
          name: data.sessionName,
          date: data.date,
          time: data.time,
          duration: data.duration,
          notes: data.notes,
          videoId: data.videoId,
        };

        setSessions((prev) => [...prev, newSession]);
        setIsScheduleDialogOpen(false);
        resolve();
      }, 1000);
    });
  };

  const handleSessionStart = (id: string, videoId?: string) => {
    if (videoId) {
      const session = sessions.find((s) => s.id === id);
      if (session) {
        const video: MeditationVideo = {
          videoId,
          title: session.name,
          thumbnailUrl: "", // Not shown when directly playing
          channelName: "", // Not shown when directly playing
          duration: session.duration,
        };
        setSelectedVideo(video);
      }
    } else {
      // If no video ID, could handle a timer-only meditation
      console.log("Starting timer-only session:", id);
    }
  };

  const handleSessionDelete = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  return (
    <div data-component="HomePage" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 px-4 md:px-6 text-center border-b border-secondary/20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-accent-800 mb-3">
          MindfulMoments
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Cultivate peace and presence in your daily life with guided meditation
          sessions
        </p>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Introduction Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Heart className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Reduce Stress</h3>
                  <p className="text-muted-foreground">
                    Regular meditation practice can significantly lower stress
                    levels and promote emotional well-being.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Info className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-medium mb-2">Improve Focus</h3>
                  <p className="text-muted-foreground">
                    Enhance concentration and mental clarity through mindfulness
                    techniques and guided practices.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/20 border-secondary/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Clock className="h-10 w-10 text-secondary-900 mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Build Consistency
                  </h3>
                  <p className="text-muted-foreground">
                    Schedule regular sessions to establish a consistent
                    meditation practice for lasting benefits.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Selected Video Player */}
        {selectedVideo && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif text-accent-700">
                Now Playing
              </h2>
              <Button variant="ghost" onClick={() => setSelectedVideo(null)}>
                Close Player
              </Button>
            </div>
            <VideoPlayer
              videoId={selectedVideo.videoId}
              title={selectedVideo.title}
              autoplay={true}
              className="max-w-3xl mx-auto"
            />
          </section>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="videos" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="videos" className="text-base">
                <Search className="w-4 h-4 mr-2" />
                Discover Meditations
              </TabsTrigger>
              <TabsTrigger value="sessions" className="text-base">
                <Calendar className="w-4 h-4 mr-2" />
                My Sessions
              </TabsTrigger>
            </TabsList>

            <Dialog
              open={isScheduleDialogOpen}
              onOpenChange={setIsScheduleDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <ScheduleSession
                  onSchedule={handleScheduleSession}
                  selectedVideoId={selectedVideo?.videoId}
                  selectedVideoTitle={selectedVideo?.title}
                />
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="videos" className="mt-0">
            <VideoGallery
              videos={videos}
              isLoading={loading}
              error={error}
              onVideoSelect={handleVideoSelect}
              onSearch={handleSearch}
            />
          </TabsContent>

          <TabsContent value="sessions" className="mt-0">
            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    id={session.id}
                    name={session.name}
                    date={session.date}
                    time={session.time}
                    duration={session.duration}
                    notes={session.notes}
                    videoId={session.videoId}
                    onStart={handleSessionStart}
                    onDelete={handleSessionDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No Sessions Scheduled
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Start by scheduling your first meditation session to establish
                  a regular practice.
                </p>
                <Button
                  onClick={() => setIsScheduleDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Your First Session
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4 text-center text-muted-foreground border-t border-secondary/20">
        <p>
          &copy; {new Date().getFullYear()} MindfulMoments. All rights reserved.
        </p>
        <p className="text-sm mt-1">
          Daily meditation practice for a more mindful life.
        </p>
      </footer>
    </div>
  );
}
