
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VideoCategory } from "./videoService";

export const fetchVideoCategories = async (): Promise<VideoCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('video_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erreur lors du chargement des catégories");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("Une erreur inattendue s'est produite");
    return [];
  }
};

export const createCategory = async (categoryData: {
  name: string;
  slug: string;
  description?: string;
}): Promise<VideoCategory | null> => {
  try {
    const { data, error } = await supabase
      .from('video_categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
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
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};
