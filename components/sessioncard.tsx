"use client";
import React from "react";
import { format } from "date-fns";
import {
  Clock,
  Calendar,
  Timer,
  Play,
  Edit,
  Trash2,
  FileText,
  Film,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  id: string;
  name: string;
  date: Date;
  time: string;
  duration: string;
  notes?: string;
  videoId?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStart?: (id: string, videoId?: string) => void;
  className?: string;
}

export function SessionCard({
  id,
  name,
  date,
  time,
  duration,
  notes,
  videoId,
  onEdit = () => {},
  onDelete = () => {},
  onStart = () => {},
  className,
}: SessionCardProps) {
  // Parse time string (e.g., "08:00") to display in readable format
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <Card
      data-component="SessionCard"
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="bg-primary/10 pb-3">
        <div className="flex justify-between items-start">
          <CardTitle
            className="text-lg md:text-xl font-serif text-accent-700 truncate"
            title={name}
          >
            {name}
          </CardTitle>
          {videoId && (
            <Badge
              variant="outline"
              className="bg-accent/10 text-accent text-xs"
            >
              <Film className="h-3 w-3 mr-1" />
              Video
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-2 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{format(date, "EEE, MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{formatTime(time)}</span>
          </div>
        </div>

        <div className="flex items-center">
          <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{duration} minutes</span>
        </div>

        {notes && (
          <div className="bg-muted p-2 rounded-md mt-2">
            <div className="flex items-start">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
              <p
                className="text-sm text-muted-foreground line-clamp-2"
                title={notes}
              >
                {notes}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between p-3 pt-2 gap-2 border-t">
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(id)}
                  aria-label="Edit session"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(id)}
                  aria-label="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button
          variant="default"
          size="sm"
          className="bg-primary hover:bg-primary/90 transition-colors"
          onClick={() => onStart(id, videoId)}
        >
          <Play className="h-4 w-4 mr-2" />
          Start Session
        </Button>
      </CardFooter>
    </Card>
  );
}
