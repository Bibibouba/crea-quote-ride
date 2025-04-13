
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
