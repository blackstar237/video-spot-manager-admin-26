
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchVideos, SpotDisplay } from '@/services/videoService';
import { fetchCategories, VideoCategory } from '@/services/categoryService';
import { VideoCard } from '@/components/spots/VideoCard';
import { SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

const SpotsListSupabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch videos with React Query
  const { data: spots = [], isLoading: spotsLoading, error: spotsError } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    meta: {
      onSuccess: (data: SpotDisplay[]) => {
        console.log('Videos loaded successfully:', data.length);
      },
    }
  });

  // Fetch categories with React Query
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['videoCategories'],
    queryFn: fetchCategories,
    meta: {
      onSuccess: (data: VideoCategory[]) => {
        console.log('Categories loaded successfully:', data.length);
      },
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

  const filteredSpots = spots
    ? spots.filter((spot) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        const matchesSearch = searchRegex.test(spot.title) || searchRegex.test(spot.description || '');

        const matchesCategory = selectedCategory === 'all' || spot.categoryId === selectedCategory;

        return matchesSearch && matchesCategory;
      })
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des Spots</h1>
        <SheetTrigger className="text-sm hover:bg-secondary/50 rounded-md px-2 py-1">
          <Filter className="w-4 h-4 mr-2 inline-block" />
          <span>Filtres</span>
        </SheetTrigger>
      </div>

      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Rechercher un spot..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          className="border rounded px-2 py-1"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {spotsLoading ? (
        <p>Chargement des spots...</p>
      ) : spotsError ? (
        <p>Erreur lors du chargement des spots.</p>
      ) : (
        <Card className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredSpots.map((spot) => (
            <VideoCard key={spot.id} spot={spot} />
          ))}
        </Card>
      )}
    </div>
  );
};

export default SpotsListSupabase;
