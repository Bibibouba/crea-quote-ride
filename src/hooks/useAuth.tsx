
import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  cleanupAuthState: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Fonction pour nettoyer les états d'authentification qui pourraient causer des problèmes
export const cleanupAuthState = () => {
  // Supprimer les jetons standards
  localStorage.removeItem('supabase.auth.token');
  
  // Supprimer toutes les clés Supabase auth de localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Supprimer du sessionStorage si utilisé
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // D'abord mettre en place l'écouteur d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Événement d\'authentification:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success('Connexion réussie');
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Déconnexion réussie');
          navigate('/');
        } else if (event === 'USER_UPDATED') {
          console.log('Utilisateur mis à jour:', currentSession?.user);
          if (currentSession?.user?.email_confirmed_at) {
            toast.success('Email confirmé avec succès');
          }
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        }
      }
    );

    // Ensuite vérifier la session existante
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      // Nettoyer l'état d'authentification existant
      cleanupAuthState();
      
      // Tenter une déconnexion globale
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuer même si cette opération échoue
        console.log('La déconnexion globale a échoué, mais nous continuons', err);
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.log('Erreur de connexion:', error);
        
        if (error.message.includes('Email not confirmed')) {
          toast.error("Votre email n'a pas été confirmé. Veuillez vérifier votre boîte de réception ou cliquer sur 'Renvoyer l'email de confirmation'.");
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error("Email ou mot de passe incorrect.");
        } else {
          toast.error(`Erreur de connexion: ${error.message}`);
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Nettoyer l'état d'authentification existant
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/connexion`;
      console.log('URL de redirection pour la confirmation:', redirectUrl);
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            companyName: userData.companyName
          },
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Erreur d\'inscription:', error);
        toast.error(`Erreur d'inscription: ${error.message}`);
        return { success: false, message: error.message };
      }
      
      if (data.user) {
        // Vérifier si l'utilisateur a déjà été créé mais n'a pas confirmé son email
        if (data.user.identities && data.user.identities.length === 0) {
          return { 
            success: false, 
            message: "Un compte avec cette adresse email existe déjà. Veuillez vous connecter ou réinitialiser votre mot de passe."
          };
        }
        
        toast.success("Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.");
        console.log('Données utilisateur après inscription:', data);
        
        return { 
          success: true, 
          message: "Veuillez vérifier votre email pour confirmer votre compte. Une fois confirmé, vous pourrez vous connecter." 
        };
      }

      return { success: false, message: "Une erreur inconnue s'est produite" };
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error(`Erreur d'inscription: ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  const signOut = async () => {
    try {
      // Nettoyer l'état d'authentification
      cleanupAuthState();
      
      // Tenter une déconnexion globale
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignorer les erreurs
        console.log('La déconnexion globale a échoué, mais nous continuons', err);
      }
      
      // Forcer un rechargement de la page pour un état propre
      window.location.href = '/';
    } catch (error: any) {
      toast.error(`Erreur de déconnexion: ${error.message}`);
    }
  };
  
  const resendConfirmationEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/connexion`
        }
      });
      
      if (error) {
        toast.error(`Erreur lors de l'envoi: ${error.message}`);
        return { success: false, message: error.message };
      }
      
      toast.success("Email de confirmation renvoyé ! Veuillez vérifier votre boîte de réception.");
      return { 
        success: true, 
        message: "Un nouvel email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception."
      };
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmationEmail,
    cleanupAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
