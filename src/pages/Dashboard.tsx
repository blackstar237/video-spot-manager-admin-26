
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Film, PlayCircle, Users, AlertCircle } from 'lucide-react';
import { fetchDashboardStats } from '@/services/dashboardService';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Chargement des statistiques...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
        <p className="text-muted-foreground mb-4">Impossible de charger les statistiques du tableau de bord.</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble et statistiques récentes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVideos || 0}</div>
            <p className="text-xs text-muted-foreground">Spots publicitaires</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">Annonceurs uniques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
            <p className="text-xs text-muted-foreground">Types de publicités</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Récents (30j)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentVideos || 0}</div>
            <p className="text-xs text-muted-foreground">Derniers 30 jours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Récents</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <h2 className="text-xl font-semibold">Spots récents</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats?.recentSpots && stats.recentSpots.length > 0 ? (
              stats.recentSpots.map((spot) => (
                <Card key={spot.id} className="overflow-hidden">
                  <div className="h-32 bg-muted">
                    {spot.thumbnailUrl ? (
                      <img
                        src={spot.thumbnailUrl}
                        alt={spot.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Film className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{spot.title}</h3>
                    <p className="text-sm text-muted-foreground">{spot.createdAt}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3">
                <Card className="flex flex-col items-center justify-center p-8">
                  <Film className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center mb-4">Aucun spot récent trouvé</p>
                  <Button asChild>
                    <Link to="/spots/new">
                      Ajouter un nouveau spot
                    </Link>
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <h2 className="text-xl font-semibold">Activité récente</h2>
          <Card>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <ul className="divide-y">
                {stats.recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-center p-4">
                    <div className="ml-4">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.title}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Aucune activité récente trouvée
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
