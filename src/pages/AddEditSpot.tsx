
import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Upload, Clock, Tag, Play, Save, ArrowLeft, Trash2, Loader2, FileVideo, FileImage } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchVideoById, 
  fetchVideoCategories, 
  createVideo, 
  updateVideo, 
  deleteVideo, 
  uploadFile, 
  VideoCategory 
} from '../services/videoService';

const AddEditSpot = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    description: '',
    category_id: '',
    tags: '',
    duration: '',
    status: 'draft',
  });

  // États pour les fichiers
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Récupérer les catégories
  const { data: categories = [] } = useQuery({
    queryKey: ['videoCategories'],
    queryFn: fetchVideoCategories,
  });

  // Récupérer les détails du spot si on est en mode édition
  const { data: videoDetails, isLoading: isLoadingVideo } = useQuery({
    queryKey: ['video', id],
    queryFn: () => fetchVideoById(id!),
    enabled: isEditing,
  });

  // Préremplir le formulaire avec les données existantes en mode édition
  useEffect(() => {
    if (isEditing && videoDetails) {
      setFormData({
        title: videoDetails.title,
        client: videoDetails.client || '',
        description: videoDetails.description || '',
        category_id: videoDetails.categoryId || '',
        tags: '', // À implémenter si nécessaire
        duration: videoDetails.duration || '',
        status: 'published', // À ajuster selon le modèle de données
      });

      if (videoDetails.videoUrl) {
        setVideoPreviewUrl(videoDetails.videoUrl);
      }

      if (videoDetails.thumbnailUrl) {
        setThumbnailPreviewUrl(videoDetails.thumbnailUrl);
      }
    }
  }, [isEditing, videoDetails]);

  // Mutations pour créer/mettre à jour/supprimer un spot
  const createMutation = useMutation({
    mutationFn: createVideo,
    onSuccess: (newVideoId) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      if (newVideoId) {
        navigate(`/spots/${newVideoId}`);
      } else {
        navigate('/spots');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateVideo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['video', id] });
      navigate('/spots');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      navigate('/spots');
    }
  });

  // Gestion du changement des champs du formulaire
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion du changement des sélects
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion de l'upload de vidéo
  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        const tempUrl = URL.createObjectURL(file);
        setVideoPreviewUrl(tempUrl);
      } else {
        toast.error("Le fichier sélectionné n'est pas une vidéo valide");
      }
    }
  };

  // Gestion de l'upload de miniature
  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setThumbnailFile(file);
        const tempUrl = URL.createObjectURL(file);
        setThumbnailPreviewUrl(tempUrl);
      } else {
        toast.error("Le fichier sélectionné n'est pas une image valide");
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Upload de la vidéo si un fichier est sélectionné
      let video_url = videoPreviewUrl;
      if (videoFile) {
        const uploadedUrl = await uploadFile(videoFile, 'videos');
        if (uploadedUrl) {
          video_url = uploadedUrl;
        } else {
          toast.error("Erreur lors de l'upload de la vidéo");
          setIsUploading(false);
          return;
        }
      }

      // S'il n'y a pas de vidéo (ni fichier ni URL existante), empêcher la soumission
      if (!video_url) {
        toast.error("Une vidéo est requise pour créer un spot publicitaire");
        setIsUploading(false);
        return;
      }

      // Upload de la miniature si un fichier est sélectionné
      let thumbnail_url = thumbnailPreviewUrl;
      if (thumbnailFile) {
        const uploadedUrl = await uploadFile(thumbnailFile, 'thumbnails');
        if (uploadedUrl) {
          thumbnail_url = uploadedUrl;
        }
      }

      const videoData = {
        title: formData.title,
        client: formData.client || null,
        description: formData.description || null,
        category_id: formData.category_id || null,
        duration: formData.duration || null,
        thumbnail_url: thumbnail_url || null,
        video_url: video_url,
      };

      if (isEditing && id) {
        updateMutation.mutate({ id, data: videoData });
      } else {
        createMutation.mutate(videoData as any);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsUploading(false);
    }
  };

  // Gestion de la suppression d'un spot
  const handleDelete = () => {
    if (isEditing && id && window.confirm("Êtes-vous sûr de vouloir supprimer ce spot ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isEditing && isLoadingVideo) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Chargement du spot...</span>
      </div>
    );
  }

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
                        value={formData.title}
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
                        value={formData.description}
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
                          value={formData.client}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select 
                          value={formData.category_id}
                          onValueChange={(value) => handleSelectChange('category_id', value)}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category: VideoCategory) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
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
                        value={formData.tags}
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
                      {videoPreviewUrl ? (
                        <div className="space-y-4">
                          <div className="w-full aspect-video bg-muted rounded-md overflow-hidden relative">
                            <video 
                              src={videoPreviewUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex justify-center gap-4">
                            <label className="cursor-pointer">
                              <Input 
                                type="file" 
                                className="hidden" 
                                onChange={handleVideoUpload}
                                accept="video/*"
                              />
                              <Button variant="outline" type="button">
                                <Upload className="mr-2 h-4 w-4" /> Remplacer
                              </Button>
                            </label>
                            <Button 
                              variant="destructive" 
                              type="button"
                              onClick={() => {
                                setVideoPreviewUrl(null);
                                setVideoFile(null);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <label 
                          className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 cursor-pointer transition-colors block"
                        >
                          <Input 
                            type="file" 
                            className="hidden" 
                            onChange={handleVideoUpload}
                            accept="video/*"
                          />
                          <div className="mx-auto flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-primary/10 p-3">
                              <FileVideo className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-medium">Importer votre vidéo</h3>
                              <p className="text-sm text-muted-foreground">Glissez-déposez ou cliquez pour sélectionner</p>
                            </div>
                          </div>
                        </label>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Miniature personnalisée</Label>
                      <div className="flex gap-4 items-center">
                        <div className="w-24 h-16 bg-muted rounded-md overflow-hidden">
                          {thumbnailPreviewUrl && (
                            <img 
                              src={thumbnailPreviewUrl}
                              alt="Miniature" 
                              className="w-full h-full object-cover"
                            />
                          )}
                          {!thumbnailPreviewUrl && (
                            <div className="flex items-center justify-center w-full h-full">
                              <FileImage className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <label className="cursor-pointer">
                          <Input 
                            type="file" 
                            className="hidden" 
                            onChange={handleThumbnailUpload}
                            accept="image/*"
                          />
                          <Button variant="outline" type="button">
                            <Upload className="mr-2 h-4 w-4" /> {thumbnailPreviewUrl ? 'Modifier' : 'Ajouter'}
                          </Button>
                        </label>
                        {thumbnailPreviewUrl && (
                          <Button 
                            variant="destructive" 
                            size="icon"
                            type="button"
                            onClick={() => {
                              setThumbnailPreviewUrl(null);
                              setThumbnailFile(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
                          value={formData.duration}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Statut</Label>
                        <Select 
                          value={formData.status}
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
                    <Button className="w-full" type="submit" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Upload en cours...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                        </>
                      )}
                    </Button>
                    {isEditing && videoPreviewUrl && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        type="button"
                        onClick={() => window.open(videoPreviewUrl, '_blank')}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Prévisualiser
                      </Button>
                    )}
                  </div>
                  {isEditing && (
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      type="button"
                      onClick={handleDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer le spot
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium">Informations</h3>
                  {isEditing && videoDetails ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ajouté le</span>
                        <span>{videoDetails.createdAt}</span>
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
