
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Upload, Clock, Tag, Play, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AddEditSpot = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  
  // État du formulaire - valeurs par défaut pour édition
  const [spotData, setSpotData] = useState({
    title: isEditing ? 'Campagne printemps 2023' : '',
    client: isEditing ? 'Mode Express' : '',
    description: isEditing ? 'Spot publicitaire pour la campagne printemps-été...' : '',
    category: isEditing ? 'Mode' : '',
    tags: isEditing ? 'printemps, mode, publicité' : '',
    duration: isEditing ? '30' : '',
    status: isEditing ? 'published' : 'draft',
  });

  // Gestion du changement des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpotData({
      ...spotData,
      [name]: value,
    });
  };

  // Gestion du changement des selects
  const handleSelectChange = (name: string, value: string) => {
    setSpotData({
      ...spotData,
      [name]: value,
    });
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation d'enregistrement réussi
    setTimeout(() => {
      toast.success(isEditing 
        ? "Le spot a été mis à jour avec succès" 
        : "Le spot a été ajouté avec succès"
      );
    }, 1000);
  };

  const handleUploadClick = () => {
    // Simulation d'ouverture de sélecteur de fichier
    toast.info("Ouverture du sélecteur de fichiers...");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a href="/spots">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Modifier le spot' : 'Ajouter un nouveau spot'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? 'Modifiez les détails du spot publicitaire'
              : 'Créez un nouveau spot publicitaire'
            }
          </p>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="media">Média</TabsTrigger>
          <TabsTrigger value="settings">Paramètres avancés</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du spot</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Entrez le titre du spot"
                        value={spotData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Entrez une description du spot"
                        value={spotData.description}
                        onChange={handleInputChange}
                        rows={5}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client">Client</Label>
                        <Input
                          id="client"
                          name="client"
                          placeholder="Nom du client"
                          value={spotData.client}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select 
                          value={spotData.category}
                          onValueChange={(value) => handleSelectChange('category', value)}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mode">Mode</SelectItem>
                            <SelectItem value="Technologie">Technologie</SelectItem>
                            <SelectItem value="Voyage">Voyage</SelectItem>
                            <SelectItem value="Alimentation">Alimentation</SelectItem>
                            <SelectItem value="Commerce">Commerce</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                      <Input
                        id="tags"
                        name="tags"
                        placeholder="printemps, mode, publicité"
                        value={spotData.tags}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="text-center">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="w-full aspect-video bg-muted rounded-md overflow-hidden relative">
                            <img 
                              src="https://source.unsplash.com/1488590528505-98d2b5aba04b" 
                              alt="Aperçu vidéo" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button variant="outline" size="icon" className="h-12 w-12 bg-white/80 hover:bg-white">
                                <Play className="h-6 w-6" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={handleUploadClick}>
                              <Upload className="mr-2 h-4 w-4" /> Remplacer
                            </Button>
                            <Button variant="destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={handleUploadClick}
                        >
                          <div className="mx-auto flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-primary/10 p-3">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-medium">Importer votre vidéo</h3>
                              <p className="text-sm text-muted-foreground">Glissez-déposez ou cliquez pour sélectionner</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Miniature personnalisée</Label>
                      <div className="flex gap-4 items-center">
                        <div className="w-24 h-16 bg-muted rounded-md overflow-hidden">
                          {isEditing && (
                            <img 
                              src="https://source.unsplash.com/1488590528505-98d2b5aba04b" 
                              alt="Miniature" 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <Button variant="outline" onClick={handleUploadClick}>
                          <Upload className="mr-2 h-4 w-4" /> {isEditing ? 'Modifier' : 'Ajouter'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Image recommandée: 16:9, format .jpg ou .png
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Durée (secondes)</Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          placeholder="30"
                          value={spotData.duration}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Statut</Label>
                        <Select 
                          value={spotData.status}
                          onValueChange={(value) => handleSelectChange('status', value)}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Sélectionnez un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Brouillon</SelectItem>
                            <SelectItem value="review">En attente</SelectItem>
                            <SelectItem value="published">Publié</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes internes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Notes visibles uniquement par l'équipe"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium">Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full" type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                    </Button>
                    {isEditing && (
                      <Button variant="outline" className="w-full">
                        Prévisualiser
                      </Button>
                    )}
                  </div>
                  {isEditing && (
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer le spot
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium">Informations</h3>
                  {isEditing ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ajouté le</span>
                        <span>15/02/2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Modifié le</span>
                        <span>22/05/2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Par</span>
                        <span>Thomas Durant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID</span>
                        <span className="font-mono text-xs">spot-{id}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Complétez le formulaire et cliquez sur Enregistrer pour créer votre spot.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default AddEditSpot;
