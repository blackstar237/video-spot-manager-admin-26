
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, Video, Users, Clock, Tag } from 'lucide-react';
import { fetchDashboardStats, DashboardStats } from '@/services/dashboardService';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  // Utilisation de React Query pour gérer les données et leur état
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  // Créer un tableau de statistiques basé sur les données
  const dashboardStats = [
    { 
      title: 'Spots Totaux', 
      value: isLoading ? '...' : `${stats?.totalVideos || 0}`, 
      icon: Video, 
      increase: stats?.totalVideos ? '↑' : '' 
    },
    { 
      title: 'Clients', 
      value: isLoading ? '...' : `${stats?.totalClients || 0}`, 
      icon: Users, 
      increase: stats?.totalClients ? '↑' : ''
    },
    { 
      title: 'Catégories', 
      value: isLoading ? '...' : `${stats?.totalCategories || 0}`, 
      icon: Tag, 
      increase: ''
    },
    { 
      title: 'Spots cette semaine', 
      value: isLoading ? '...' : `${stats?.recentVideos || 0}`, 
      icon: Clock, 
      increase: stats?.recentVideos ? '↑' : ''
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace d'administration de spots publicitaires.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              {stat.increase && (
                <div className="mt-4 flex items-center text-xs text-green-600">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>{stat.increase}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <p>Chargement des activités récentes...</p>
              </div>
            ) : isError ? (
              <div className="space-y-4">
                <p>Erreur lors du chargement des activités récentes.</p>
              </div>
            ) : stats?.recentActivity.length === 0 ? (
              <div className="space-y-4">
                <p>Aucune activité récente à afficher.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}: {activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Par {activity.user} · {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Spots récents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <p>Chargement des spots récents...</p>
              </div>
            ) : isError ? (
              <div className="space-y-4">
                <p>Erreur lors du chargement des spots récents.</p>
              </div>
            ) : stats?.recentSpots.length === 0 ? (
              <div className="space-y-4">
                <p>Aucun spot récent à afficher.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentSpots.map((spot) => (
                  <div key={spot.id} className="flex gap-3 items-center">
                    <div className="w-16 h-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {spot.thumbnailUrl ? (
                        <img 
                          src={spot.thumbnailUrl} 
                          alt={spot.title}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{spot.title}</p>
                      <p className="text-xs text-muted-foreground">Ajouté le {spot.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
