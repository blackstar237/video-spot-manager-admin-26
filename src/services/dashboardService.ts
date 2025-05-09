
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
    // Récupérer le nombre total de vidéos
    const { count: totalVideos, error: videosError } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });

    if (videosError) throw videosError;

    // Récupérer le nombre de clients distincts
    const { data: clientsData, error: clientsError } = await supabase
      .from('videos')
      .select('client')
      .not('client', 'is', null);

    if (clientsError) throw clientsError;
    
    // Filtrer les clients uniques
    const uniqueClients = new Set(clientsData.map(item => item.client));
    const totalClients = uniqueClients.size;

    // Récupérer le nombre de catégories
    const { count: totalCategories, error: categoriesError } = await supabase
      .from('video_categories')
      .select('*', { count: 'exact', head: true });

    if (categoriesError) throw categoriesError;

    // Récupérer le nombre de vidéos ajoutées cette semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { count: recentVideos, error: recentVideosError } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    if (recentVideosError) throw recentVideosError;

    // Récupérer les spots récents pour l'activité
    const { data: recentVideosData, error: recentVideosDataError } = await supabase
      .from('videos')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(4);

    if (recentVideosDataError) throw recentVideosDataError;

    // Formater les données d'activité récente
    const recentActivity = recentVideosData.map(video => ({
      id: video.id,
      action: 'Spot ajouté',
      title: video.title,
      user: 'Admin', // Par défaut car nous n'avons pas d'utilisateurs
      time: formatTimeAgo(new Date(video.created_at)),
    }));

    // Récupérer les spots récents pour l'affichage
    const { data: recentSpots, error: recentSpotsError } = await supabase
      .from('videos')
      .select('id, title, thumbnail_url, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentSpotsError) throw recentSpotsError;

    // Formater les spots récents
    const formattedRecentSpots = recentSpots.map(spot => ({
      id: spot.id,
      title: spot.title,
      thumbnailUrl: spot.thumbnail_url,
      createdAt: new Date(spot.created_at).toLocaleDateString(),
    }));

    return {
      totalVideos: totalVideos || 0,
      totalClients: totalClients || 0,
      totalCategories: totalCategories || 0,
      recentVideos: recentVideos || 0,
      recentActivity,
      recentSpots: formattedRecentSpots,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    toast.error("Erreur lors du chargement des statistiques du tableau de bord");
    
    // Retourner des valeurs par défaut en cas d'erreur
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

// Fonction utilitaire pour formater le temps écoulé
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "Il y a quelques instants";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 172800) {
    return "Hier";
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
};

