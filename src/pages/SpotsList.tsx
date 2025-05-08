
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Plus, Search, Calendar, Tag, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/spots/VideoCard';

// Données simulées
const mockSpots = [
  { 
    id: 1, 
    title: 'Campagne printemps 2023', 
    client: 'Mode Express', 
    duration: '30s', 
    category: 'Mode', 
    createdAt: '2023-02-15', 
    status: 'Publié',
    thumbnailUrl: 'https://source.unsplash.com/1488590528505-98d2b5aba04b'
  },
  { 
    id: 2, 
    title: 'Événement annuel', 
    client: 'Tech Solutions', 
    duration: '45s', 
    category: 'Technologie', 
    createdAt: '2023-03-10', 
    status: 'En attente',
    thumbnailUrl: 'https://source.unsplash.com/1605810230434-7631ac76ec81'
  },
  { 
    id: 3, 
    title: 'Promotion été', 
    client: 'Vacances Plus', 
    duration: '20s', 
    category: 'Voyage', 
    createdAt: '2023-04-22', 
    status: 'Publié',
    thumbnailUrl: 'https://source.unsplash.com/1649972904349-6e44c42644a7' 
  },
  { 
    id: 4, 
    title: 'Lancement produit', 
    client: 'Innov Electronics', 
    duration: '60s', 
    category: 'Technologie', 
    createdAt: '2023-05-05', 
    status: 'Brouillon',
    thumbnailUrl: 'https://source.unsplash.com/1461749280684-dccba630e2f6' 
  },
  { 
    id: 5, 
    title: 'Offre spéciale', 
    client: 'MegaStore', 
    duration: '15s', 
    category: 'Commerce', 
    createdAt: '2023-05-18', 
    status: 'Publié',
    thumbnailUrl: 'https://source.unsplash.com/1581091226825-a6a2a5aee158' 
  },
  { 
    id: 6, 
    title: 'Campagne automne', 
    client: 'Style & Co', 
    duration: '30s', 
    category: 'Mode', 
    createdAt: '2023-06-01', 
    status: 'En attente',
    thumbnailUrl: 'https://source.unsplash.com/1526374965328-7f61d4dc18c5' 
  },
];

const SpotsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState('grid');

  const filteredSpots = mockSpots.filter(spot => {
    const matchesSearch = spot.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          spot.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || spot.category === selectedCategory;
    
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
              <SelectItem value="Mode">Mode</SelectItem>
              <SelectItem value="Technologie">Technologie</SelectItem>
              <SelectItem value="Voyage">Voyage</SelectItem>
              <SelectItem value="Commerce">Commerce</SelectItem>
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

      <Tabs value={view} className="w-full">
        <TabsContent value="grid" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSpots.map((spot) => (
              <VideoCard key={spot.id} spot={spot} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <Card>
            <div className="divide-y">
              {filteredSpots.map((spot) => (
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
                          <Video className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80">
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
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpotsList;
