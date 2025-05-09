
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  duration: string | null;
  client: string | null;
  views: number | null;
  category_id: string | null;
  upload_date: string | null;
  created_at: string | null;
}

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner_url: string | null;
  created_at: string | null;
}

export interface SpotDisplay {
  id: string;
  title: string;
  client: string; 
  duration: string; 
  category: string;
  createdAt: string;
  status: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  categoryId?: string;
  description?: string | null;
}

export const fetchVideos = async (): Promise<SpotDisplay[]> => {
  try {
    console.log("Fetching videos...");
    
    const { data: videos, error } = await supabase
      .from('videos')
      .select(`
        *,
        video_categories (name)
      `);

    if (error) {
      console.error("Error fetching videos:", error);
      toast.error("Erreur lors du chargement des vidéos");
      return [];
    }

    console.log(`Fetched ${videos?.length || 0} videos from database`);
    
    if (!videos || videos.length === 0) {
      console.log("No videos found in the database");
      return [];
    }

    // Transform Supabase data to match our app's format
    return videos.map(video => ({
      id: video.id,
      title: video.title || "Sans titre",
      client: video.client || "Client non spécifié",
      duration: video.duration || "0s",
      category: video.video_categories?.name || "Non catégorisé",
      categoryId: video.category_id,
      createdAt: video.created_at ? new Date(video.created_at).toLocaleDateString() : "Date inconnue",
      status: "Publié", // Default status, you may want to add a status field in your database
      thumbnailUrl: video.thumbnail_url,
      videoUrl: video.video_url,
      description: video.description
    }));
  } catch (error) {
    console.error("Unexpected error in fetchVideos:", error);
    toast.error("Une erreur inattendue s'est produite lors du chargement des vidéos");
    return [];
  }
};

export const fetchVideoCategories = async (): Promise<VideoCategory[]> => {
  try {
    console.log("Fetching video categories...");
    
    const { data, error } = await supabase
      .from('video_categories')
      .select('*');

    if (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erreur lors du chargement des catégories");
      return [];
    }

    console.log(`Fetched ${data?.length || 0} categories from database`);
    return data || [];
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return [];
  }
};

export const fetchVideoById = async (id: string): Promise<SpotDisplay | null> => {
  try {
    const { data: video, error } = await supabase
      .from('videos')
      .select(`
        *,
        video_categories (name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching video:", error);
      toast.error("Erreur lors du chargement de la vidéo");
      return null;
    }

    return {
      id: video.id,
      title: video.title,
      client: video.client || "Client non spécifié",
      duration: video.duration || "0s",
      category: video.video_categories?.name || "Non catégorisé",
      categoryId: video.category_id,
      createdAt: video.created_at ? new Date(video.created_at).toLocaleDateString() : "Date inconnue",
      status: "Publié", // Default status
      thumbnailUrl: video.thumbnail_url,
      videoUrl: video.video_url,
      description: video.description
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return null;
  }
};

export const uploadFile = async (file: File, path: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('video-spots')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      toast.error("Erreur lors de l'upload du fichier");
      return null;
    }

    const { data } = supabase
      .storage
      .from('video-spots')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    toast.error("Une erreur inattendue s'est produite lors de l'upload");
    return null;
  }
};

export const createVideo = async (videoData: { 
  title: string;
  video_url: string;
  client?: string | null;
  description?: string | null;
  duration?: string | null;
  category_id?: string | null;
  thumbnail_url?: string | null;
}): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .insert(videoData)
      .select();

    if (error) {
      console.error("Error creating video:", error);
      toast.error("Erreur lors de la création de la vidéo");
      return null;
    }

    toast.success("Vidéo créée avec succès");
    return data[0]?.id || null;
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return null;
  }
};

export const updateVideo = async (id: string, videoData: { 
  title?: string;
  video_url?: string;
  client?: string | null;
  description?: string | null;
  duration?: string | null;
  category_id?: string | null;
  thumbnail_url?: string | null;
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', id);

    if (error) {
      console.error("Error updating video:", error);
      toast.error("Erreur lors de la mise à jour de la vidéo");
      return false;
    }

    toast.success("Vidéo mise à jour avec succès");
    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return false;
  }
};

export const deleteVideo = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting video:", error);
      toast.error("Erreur lors de la suppression de la vidéo");
      return false;
    }

    toast.success("Vidéo supprimée avec succès");
    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return false;
  }
};

export const incrementViews = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_video_views', { video_id: id });
    
    if (error) {
      console.error("Error incrementing views:", error);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};
