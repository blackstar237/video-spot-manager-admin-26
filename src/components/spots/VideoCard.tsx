import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Play, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { incrementViews } from '@/services/videoService';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
interface VideoCardProps {
  spot: {
    id: string;
    title: string;
    client: string;
    duration: string;
    category: string;
    createdAt: string;
    status: string;
    thumbnailUrl?: string;
    videoUrl?: string;
  };
}
export const VideoCard = ({
  spot
}: VideoCardProps) => {
  const [videoOpen, setVideoOpen] = useState(false);
  const handleOpenVideo = () => {
    if (spot.id) {
      incrementViews(spot.id);
    }
    setVideoOpen(true);
  };
  return <>
      <Card className="video-card overflow-hidden">
        <div className="video-thumbnail relative h-40 bg-muted">
          {spot.thumbnailUrl ? <img src={spot.thumbnailUrl} alt={spot.title} className="object-cover w-full h-full" /> : <div className="flex items-center justify-center w-full h-full">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button variant="outline" size="icon" className="h-10 w-10 bg-white/80 hover:bg-white" onClick={handleOpenVideo}>
              <Play className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/spots/${spot.id}`} className="font-medium hover:underline text-lg line-clamp-1">
              {spot.title}
            </Link>
            <Badge variant={spot.status === 'Publié' ? 'default' : spot.status === 'En attente' ? 'outline' : 'secondary'}>
              {spot.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{spot.client}</p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {spot.createdAt}
            </div>
            <div className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {spot.category}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {spot.duration}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl h-auto p-0 overflow-hidden bg-black border-none">
          <DialogTitle className="sr-only">Aperçu de la vidéo</DialogTitle>
          {spot.videoUrl && <video className="w-full h-auto" src={spot.videoUrl} controls autoPlay controlsList="nodownload" poster={spot.thumbnailUrl}>
              Votre navigateur ne prend pas en charge la lecture vidéo.
            </video>}
        </DialogContent>
      </Dialog>
    </>;
};