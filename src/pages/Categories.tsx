
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { fetchVideoCategories, createCategory, deleteCategory } from "@/services/categoryService";
import { VideoCategory } from "@/services/videoService";

const Categories = () => {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = React.useState({
    name: "",
    slug: "",
    description: "",
  });
  
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchVideoCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Catégorie créée avec succès");
      setNewCategory({ name: "", slug: "", description: "" });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la catégorie:", error);
      toast.error("Erreur lors de la création de la catégorie");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Catégorie supprimée avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      toast.error("Erreur lors de la suppression de la catégorie");
    }
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      toast.error("Le nom et le slug sont obligatoires");
      return;
    }
    createMutation.mutate(newCategory);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      deleteMutation.mutate(id);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewCategory({
      ...newCategory,
      name,
      slug: generateSlug(name),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Catégories</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle catégorie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom</label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={handleNameChange}
                  placeholder="Nom de la catégorie"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                <Input
                  id="slug"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="slug-de-categorie"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Description de la catégorie"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Annuler</Button>
                </DialogClose>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Création..." : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        {isLoading ? (
          <div className="py-10 text-center">Chargement des catégories...</div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center">Aucune catégorie disponible</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: VideoCategory) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Categories;
