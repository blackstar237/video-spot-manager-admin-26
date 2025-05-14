
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Mettre en place un écouteur pour les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Afficher un écran de chargement pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Rediriger vers le tableau de bord si connecté, sinon vers la page de connexion
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
