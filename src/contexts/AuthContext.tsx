
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth event:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success('Connexion réussie');
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Déconnexion réussie');
          navigate('/');
        } else if (event === 'USER_UPDATED') {
          console.log('User updated:', currentSession?.user);
          if (currentSession?.user?.email_confirmed_at) {
            toast.success('Email confirmé avec succès');
          }
        }
      }
    );

    // Then check for existing session
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error("Votre email n'a pas été confirmé. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.");
        } else {
          toast.error(`Erreur de connexion: ${error.message}`);
        }
        throw error;
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            company_name: userData.companyName
          },
          emailRedirectTo: `${window.location.origin}/connexion`
        }
      });
      
      if (error) {
        toast.error(`Erreur d'inscription: ${error.message}`);
        return { success: false, message: error.message };
      }
      
      if (data.user) {
        toast.success("Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.");
        return { 
          success: true, 
          message: "Veuillez vérifier votre email pour confirmer votre compte. Une fois confirmé, vous pourrez vous connecter." 
        };
      }

      return { success: false, message: "Une erreur inconnue s'est produite" };
    } catch (error: any) {
      toast.error(`Erreur d'inscription: ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      toast.error(`Erreur de déconnexion: ${error.message}`);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut
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
