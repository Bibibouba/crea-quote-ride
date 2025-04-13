
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SideNav from './SideNav';
import Header from './Header';
import { supabase } from '@/integrations/supabase/client';

interface CompanySettings {
  id: string;
  driver_id: string;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  font_family: string | null;
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company_name: string | null;
}

const DashboardLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        // Try to fetch from profiles table first
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // If profile doesn't exist, use auth metadata
          setProfile({
            id: user.id,
            first_name: user.user_metadata?.first_name || null,
            last_name: user.user_metadata?.last_name || null,
            email: user.email,
            company_name: user.user_metadata?.company_name || null
          });
        } else {
          setProfile(profileData as UserProfile);
        }

        // Try to fetch company settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('company_settings')
          .select('*')
          .eq('driver_id', user.id)
          .single();

        if (!settingsError) {
          setCompanySettings(settingsData as CompanySettings);
        } else {
          console.log('No company settings found, creating default...');
          
          // Create default company settings if none exists
          const { data: newSettings, error: createError } = await supabase
            .from('company_settings')
            .insert({
              driver_id: user.id,
              logo_url: null,
              banner_url: null,
              primary_color: '#0070f3',
              secondary_color: '#ff4088',
              font_family: 'Inter, sans-serif'
            })
            .select()
            .single();
            
          if (!createError && newSettings) {
            setCompanySettings(newSettings as CompanySettings);
          } else {
            console.error('Error creating company settings:', createError);
          }
        }
      } catch (error) {
        console.error('Error in data fetching:', error);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  if (!user) {
    return null; // Redirecting to login page from useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        logoUrl={companySettings?.logo_url || undefined} 
        userEmail={profile?.email || user.email || ''} 
        userName={profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : user.email || ''} 
      />
      <div className="flex flex-1 overflow-hidden">
        <SideNav companyName={profile?.company_name || user.user_metadata?.company_name || 'Dashboard'} />
        <main className="flex-1 overflow-y-auto p-6 pt-16 bg-secondary/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
