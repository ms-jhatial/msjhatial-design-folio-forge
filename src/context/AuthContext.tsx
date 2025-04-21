
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, UserData } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing user data
    const existingUser = storageService.getCurrentUser();
    if (existingUser) {
      setUserData(existingUser);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, email: string) => {
    try {
      const existingUser = storageService.getCurrentUser();
      if (existingUser) {
        setUserData(existingUser);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${existingUser.user.username}`,
        });
      } else {
        const newUserData = storageService.createUser(username, email);
        setUserData(newUserData);
        toast({
          title: "Account created",
          description: "Your portfolio has been initialized with sample content",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    storageService.clearUserData();
    setUserData(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isAuthenticated: !!userData,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
