
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchVideos, SpotDisplay } from '@/services/videoService';
import { fetchCategories, VideoCategory } from '@/services/categoryService';
import { VideoCard } from '@/components/spots/VideoCard';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

const SpotsListSupabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch videos with React Query
  const {
    data: spots = [],
    isLoading: spotsLoading,
    error: spotsError
  } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    meta: {
      onSuccess: (data: SpotDisplay[]) => {
        console.log('Videos loaded successfully:', data.length);
      }
    }
  });

  // Fetch categories with React Query
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['videoCategories'],
    queryFn: fetchCategories,
    meta: {
      onSuccess: (data: VideoCategory[]) => {
        console.log('Categories loaded successfully:', data.length);
      }
    }
  });

  // Log any errors
  if (spotsError) {
    console.error('Error fetching videos:', spotsError);
    toast.error('Erreur lors du chargement des vidéos');
  }
  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    toast.error('Erreur lors du chargement des catégories');
  }

  const filteredSpots = spots ? spots.filter(spot => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(spot.title) || searchRegex.test(spot.description || '');
    const matchesCategory = selectedCategory === 'all' || spot.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des Spots</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-sm bg-background border border-border hover:bg-accent">
              <Filter className="w-4 h-4 mr-2 inline-block" />
              <span>Filtres</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">Filtres avancés</h3>
              {/* Contenu des filtres à venir */}
              <p className="text-muted-foreground">Options de filtrage supplémentaires à implémenter.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Rechercher un spot..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
            className="w-full bg-background border-border"
          />
        </div>
        <select 
          value={selectedCategory} 
          onChange={handleCategoryChange} 
          className="border rounded-md px-3 py-2 bg-background border-border text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {spotsLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : spotsError ? (
        <div className="text-destructive text-center py-8 bg-card rounded-lg p-4">
          <p className="font-medium">Erreur lors du chargement des spots.</p>
          <p className="text-sm">Veuillez réessayer plus tard.</p>
        </div>
      ) : (
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredSpots.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-8">Aucun spot trouvé</p>
            ) : (
              filteredSpots.map(spot => (
                <VideoCard key={spot.id} spot={spot} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotsListSupabase;
