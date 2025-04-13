
import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  logoUrl?: string;
  userEmail: string;
  userName: string;
}

const Header = ({ logoUrl, userEmail, userName }: HeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/connexion');
  };

  const getInitials = (name: string) => {
    if (!name || name === userEmail) return userEmail.substring(0, 2).toUpperCase();
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 border-b bg-background fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Company Logo" 
              className="h-8 max-w-[120px] object-contain"
            />
          ) : (
            <span className="text-lg font-semibold">Driver Dashboard</span>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={logoUrl} alt={userName} />
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {userName && <p className="font-medium">{userName}</p>}
                {userEmail && (
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
