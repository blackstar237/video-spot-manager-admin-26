
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
    console.log("Fetching dashboard stats...");
    
    // Fetch total videos count
    const videosResult = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });
    
    if (videosResult.error) {
      console.error("Error fetching videos count:", videosResult.error);
      throw videosResult.error;
    }
    
    const totalVideos = videosResult.count || 0;
    console.log(`Total videos: ${totalVideos}`);
    
    // Fetch unique clients count
    const clientsResult = await supabase
      .from('videos')
      .select('client')
      .not('client', 'is', null);
    
    if (clientsResult.error) {
      console.error("Error fetching clients:", clientsResult.error);
      throw clientsResult.error;
    }
    
    // Get unique client count
    const uniqueClients = new Set(clientsResult.data?.map(video => video.client) || []);
    console.log(`Total unique clients: ${uniqueClients.size}`);
    
    // Fetch categories count
    const categoriesResult = await supabase
      .from('video_categories')
      .select('*', { count: 'exact', head: true });
    
    if (categoriesResult.error) {
      console.error("Error fetching categories count:", categoriesResult.error);
      throw categoriesResult.error;
    }
    
    const totalCategories = categoriesResult.count || 0;
    console.log(`Total categories: ${totalCategories}`);
    
    // Fetch recent videos (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentVideosResult = await supabase
      .from('videos')
      .select('*')
      .gt('created_at', thirtyDaysAgo.toISOString());
    
    if (recentVideosResult.error) {
      console.error("Error fetching recent videos:", recentVideosResult.error);
      throw recentVideosResult.error;
    }
    
    const recentVideosCount = recentVideosResult.data?.length || 0;
    console.log(`Recent videos (30 days): ${recentVideosCount}`);
    
    // Fetch most recent videos for the spots section
    const recentSpotsResult = await supabase
      .from('videos')
      .select('id, title, thumbnail_url, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentSpotsResult.error) {
      console.error("Error fetching recent spots:", recentSpotsResult.error);
      throw recentSpotsResult.error;
    }
    
    console.log(`Recent spots fetched: ${recentSpotsResult.data?.length || 0}`);
    
    // Generate mock activity for now (this would typically come from a dedicated activities table)
    const recentActivity = [
      { id: '1', action: 'a ajouté', title: 'Nouveau spot publicitaire', user: 'Marc', time: '2h ago' },
      { id: '2', action: 'a modifié', title: 'Campagne été', user: 'Sophie', time: '1d ago' },
      { id: '3', action: 'a supprimé', title: 'Ancien spot', user: 'Thomas', time: '2d ago' },
      { id: '4', action: 'a visionné', title: 'Nouvelle collection', user: 'Julie', time: '3d ago' },
      { id: '5', action: 'a commenté', title: 'Spot promotionnel', user: 'Léa', time: '5d ago' },
    ];
    
    // Transform recent spots data to match the expected format
    const formattedRecentSpots = recentSpotsResult.data?.map(spot => ({
      id: spot.id,
      title: spot.title || "Sans titre",
      thumbnailUrl: spot.thumbnail_url,
      createdAt: spot.created_at ? new Date(spot.created_at).toLocaleDateString() : "Date inconnue",
    })) || [];
    
    return {
      totalVideos,
      totalClients: uniqueClients.size,
      totalCategories,
      recentVideos: recentVideosCount,
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
