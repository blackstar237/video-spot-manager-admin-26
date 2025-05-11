
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchCategories, createCategory, deleteCategory, VideoCategory } from '@/services/categoryService';
import { supabase } from "@/integrations/supabase/client";

const categorySchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  slug: z.string().min(2, { message: "Le slug doit contenir au moins 2 caractères" }),
  description: z.string().optional(),
  banner_url: z.string().optional(),
});

const Categories = () => {
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      banner_url: '',
    },
  });

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error("Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    try {
      await createCategory({
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        banner_url: data.banner_url || undefined
      });
      
      toast.success("Catégorie créée avec succès");
      form.reset();
      setBannerPreview(null);
      setDialogOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error("Erreur lors de la création de la catégorie");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!id) return;
    
    setDeleting(id);
    try {
      await deleteCategory(id);
      toast.success("Catégorie supprimée avec succès");
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Erreur lors de la suppression de la catégorie");
    } finally {
      setDeleting(null);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    
    // Auto-generate slug from name
    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
      
    form.setValue('slug', slug);
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Le fichier sélectionné n'est pas une image");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse. Taille maximale: 2MB");
      return;
    }

    setUploadingBanner(true);
    
    try {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setBannerPreview(objectUrl);

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('categories')
        .upload(`banners/${fileName}`, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('categories')
        .getPublicUrl(`banners/${fileName}`);

      form.setValue('banner_url', publicUrl);
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast.error("Erreur lors du téléchargement de l'image");
      setBannerPreview(null);
    } finally {
      setUploadingBanner(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Chargement des catégories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">Gérez les catégories de spots publicitaires</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Automobile" {...field} onChange={handleNameChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: automobile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Description de la catégorie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="banner_url"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Bannière (optionnel)</FormLabel>
                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={triggerFileInput}
                          disabled={uploadingBanner}
                          className="w-full"
                        >
                          {uploadingBanner ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Choisir une image
                            </>
                          )}
                        </Button>
                        
                        {bannerPreview && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground mb-2">Aperçu:</p>
                            <img
                              src={bannerPreview}
                              alt="Aperçu de la bannière"
                              className="rounded-md object-cover h-32 w-full"
                            />
                          </div>
                        )}
                        <input type="hidden" {...field} value={value} onChange={onChange} />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Annuler</Button>
                  </DialogClose>
                  <Button type="submit" disabled={uploadingBanner}>Créer</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Bannière</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune catégorie trouvée
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell>
                    {category.banner_url ? (
                      <img 
                        src={category.banner_url} 
                        alt={`Bannière ${category.name}`} 
                        className="w-16 h-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deleting === category.id}
                    >
                      {deleting === category.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Categories;
