
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DashboardStats {
  totalVideos: number;
  totalClients: number;
  totalCategories: number;
  recentVideos: number;
  recentActivity: {
    id: string;
    action: string;
    title: string;
    user: string;
    time: string;
  }[];
  recentSpots: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    createdAt: string;
  }[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch total videos count
    const { count: totalVideos, error: videosError } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });
    
    if (videosError) {
      console.error("Error fetching videos count:", videosError);
      throw videosError;
    }
    
    // Fetch unique clients count
    const { data: clients, error: clientsError } = await supabase
      .from('videos')
      .select('client')
      .not('client', 'is', null);
    
    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      throw clientsError;
    }
    
    // Get unique client count
    const uniqueClients = new Set(clients.map(video => video.client));
    
    // Fetch categories count
    const { count: totalCategories, error: categoriesError } = await supabase
      .from('video_categories')
      .select('*', { count: 'exact', head: true });
    
    if (categoriesError) {
      console.error("Error fetching categories count:", categoriesError);
      throw categoriesError;
    }
    
    // Fetch recent videos (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentVideosData, error: recentVideosError } = await supabase
      .from('videos')
      .select('*')
      .gt('created_at', thirtyDaysAgo.toISOString());
    
    if (recentVideosError) {
      console.error("Error fetching recent videos:", recentVideosError);
      throw recentVideosError;
    }
    
    // Fetch most recent videos for the spots section
    const { data: recentSpots, error: recentSpotsError } = await supabase
      .from('videos')
      .select('id, title, thumbnail_url, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentSpotsError) {
      console.error("Error fetching recent spots:", recentSpotsError);
      throw recentSpotsError;
    }
    
    // Generate mock activity for now (this would typically come from a dedicated activities table)
    const recentActivity = [
      { id: '1', action: 'a ajouté', title: 'Nouveau spot publicitaire', user: 'Marc', time: '2h ago' },
      { id: '2', action: 'a modifié', title: 'Campagne été', user: 'Sophie', time: '1d ago' },
      { id: '3', action: 'a supprimé', title: 'Ancien spot', user: 'Thomas', time: '2d ago' },
      { id: '4', action: 'a visionné', title: 'Nouvelle collection', user: 'Julie', time: '3d ago' },
      { id: '5', action: 'a commenté', title: 'Spot promotionnel', user: 'Léa', time: '5d ago' },
    ];
    
    // Transform recent spots data to match the expected format
    const formattedRecentSpots = recentSpots.map(spot => ({
      id: spot.id,
      title: spot.title,
      thumbnailUrl: spot.thumbnail_url,
      createdAt: spot.created_at ? new Date(spot.created_at).toLocaleDateString() : "Date inconnue",
    }));
    
    return {
      totalVideos: totalVideos || 0,
      totalClients: uniqueClients.size,
      totalCategories: totalCategories || 0,
      recentVideos: recentVideosData?.length || 0,
      recentActivity,
      recentSpots: formattedRecentSpots,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    toast.error("Erreur lors du chargement des statistiques du tableau de bord");
    
    // Return fallback data when there's an error
    return {
      totalVideos: 0,
      totalClients: 0,
      totalCategories: 0,
      recentVideos: 0,
      recentActivity: [],
      recentSpots: [],
    };
  }
};
