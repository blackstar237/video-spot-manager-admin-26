
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Plus, Search, Calendar, Tag, Clock, Video as VideoIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/spots/VideoCard';
import { fetchVideos, fetchVideoCategories, SpotDisplay, VideoCategory } from '@/services/videoService';
import { useQuery } from '@tanstack/react-query';

const SpotsListSupabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState('grid');

  const { data: spots = [], isLoading: spotsLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['videoCategories'],
    queryFn: fetchVideoCategories,
  });

  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (spot.client && spot.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || spot.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Spots publicitaires</h1>
          <p className="text-muted-foreground">Gérez tous vos spots publicitaires</p>
        </div>
        <Button asChild>
          <Link to="/spots/new">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un spot
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un spot..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category: VideoCategory) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="grid" className="w-auto" value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="grid">Grille</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {spotsLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Chargement des spots...</span>
        </div>
      ) : (
        <Tabs value={view} className="w-full">
          <TabsContent value="grid" className="mt-0">
            {filteredSpots.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun spot publicitaire ne correspond à votre recherche.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSpots.map((spot) => (
                  <VideoCard key={spot.id} spot={spot} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <Card>
              <div className="divide-y">
                {filteredSpots.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Aucun spot publicitaire ne correspond à votre recherche.
                  </div>
                ) : (
                  filteredSpots.map((spot) => (
                    <div key={spot.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="w-24 h-16 relative rounded overflow-hidden bg-muted">
                          {spot.thumbnailUrl ? (
                            <img 
                              src={spot.thumbnailUrl} 
                              alt={spot.title} 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <VideoIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80" onClick={() => {
                              if (spot.id) {
                                incrementViews(spot.id);
                              }
                              // Ouvrir la vidéo ici
                              window.open(spot.videoUrl, "_blank");
                            }}>
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <Link to={`/spots/${spot.id}`} className="font-medium hover:underline">
                            {spot.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">{spot.client}</p>
                          <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
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
                        </div>
                        <Badge variant={
                          spot.status === 'Publié' ? 'default' : 
                          spot.status === 'En attente' ? 'outline' : 'secondary'
                        }>
                          {spot.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SpotsListSupabase;
