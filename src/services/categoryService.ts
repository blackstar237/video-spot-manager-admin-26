
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner_url: string | null;
  created_at: string | null;
}

export const fetchCategories = async (): Promise<VideoCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('video_categories')
      .select('*');

    if (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erreur lors du chargement des catégories");
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return [];
  }
};

export const createCategory = async (category: { 
  name: string; 
  slug: string; 
  description?: string | null;
  banner_url?: string | null;
}): Promise<VideoCategory | null> => {
  try {
    const { data, error } = await supabase
      .from('video_categories')
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      toast.error("Erreur lors de la création de la catégorie");
      return null;
    }

    toast.success("Catégorie créée avec succès");
    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return null;
  }
};

export const updateCategory = async (id: string, category: {
  name: string;
  slug: string;
  description?: string | null;
  banner_url?: string | null;
}): Promise<VideoCategory | null> => {
  try {
    const { data, error } = await supabase
      .from('video_categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      toast.error("Erreur lors de la mise à jour de la catégorie");
      return null;
    }

    toast.success("Catégorie mise à jour avec succès");
    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('video_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting category:", error);
      toast.error("Erreur lors de la suppression de la catégorie");
      return false;
    }

    toast.success("Catégorie supprimée avec succès");
    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return false;
  }
};

// Fonction pour uploader une image de bannière
export const uploadCategoryBanner = async (file: File): Promise<string | null> => {
  try {
    // Création d'un nom de fichier unique
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    
    // Upload du fichier dans le bucket "categories"
    const { data, error } = await supabase.storage
      .from('categories')
      .upload(`banners/${fileName}`, file);

    if (error) {
      console.error("Error uploading banner:", error);
      toast.error("Erreur lors du téléchargement de l'image");
      return null;
    }

    // Récupération de l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('categories')
      .getPublicUrl(`banners/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    toast.error("Une erreur inattendue s'est produite");
    return null;
  }
};
