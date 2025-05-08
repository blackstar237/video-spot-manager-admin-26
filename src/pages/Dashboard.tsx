
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, Video, Users, Clock, Tag } from 'lucide-react';

const Dashboard = () => {
  // Données simulées
  const stats = [
    { title: 'Spots Totaux', value: '158', icon: Video, increase: '12%' },
    { title: 'Clients', value: '24', icon: Users, increase: '5%' },
    { title: 'Catégories', value: '8', icon: Tag, increase: '0%' },
    { title: 'Spots cette semaine', value: '14', icon: Clock, increase: '18%' },
  ];

  // Données simulées pour l'activité récente
  const recentActivity = [
    { id: 1, action: 'Spot ajouté', title: 'Campagne été 2023', user: 'Thomas', time: 'Il y a 2 heures' },
    { id: 2, action: 'Spot modifié', title: 'Promo de printemps', user: 'Sophie', time: 'Il y a 5 heures' },
    { id: 3, action: 'Client ajouté', title: 'Mode Express', user: 'Thomas', time: 'Il y a 8 heures' },
    { id: 4, action: 'Spot ajouté', title: 'Événement annuel', user: 'Marie', time: 'Hier' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace d'administration de spots publicitaires.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
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
                  <span>{stat.increase} depuis le mois dernier</span>
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
            <div className="space-y-4">
              {recentActivity.map((activity) => (
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
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Spots récents</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Ici, on pourrait ajouter un composant pour afficher les spots récents */}
            <div className="space-y-4">
              {[1, 2, 3].map((spot) => (
                <div key={spot} className="flex gap-3 items-center">
                  <div className="w-16 h-10 bg-muted rounded-md flex items-center justify-center">
                    <Video className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Spot de campagne #{spot}</p>
                    <p className="text-xs text-muted-foreground">Ajouté le {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
