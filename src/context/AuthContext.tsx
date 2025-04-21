
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, UserData } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, email: string) => void;
  logout: () => void;
  updateUserData: (data: UserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user data from localStorage on initial mount
  useEffect(() => {
    try {
      // Check for existing user data
      const existingUser = storageService.getCurrentUser();
      if (existingUser) {
        setUserData(existingUser);
        console.log('User data loaded from localStorage:', existingUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error loading data",
        description: "There was a problem loading your saved data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Function to update user data in state and localStorage
  const updateUserData = (data: UserData) => {
    try {
      console.log('Updating user data in context:', data);
      setUserData(data);
      storageService.saveUserData(data);
    } catch (error) {
      console.error('Error updating user data:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your data.",
        variant: "destructive",
      });
    }
  };

  const login = (username: string, email: string) => {
    try {
      const existingUser = storageService.getCurrentUser();
      if (existingUser) {
        setUserData(existingUser);
        console.log('User logged in with existing data:', existingUser);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${existingUser.user.username}`,
        });
      } else {
        const newUserData = storageService.createUser(username, email);
        setUserData(newUserData);
        console.log('New user created:', newUserData);
        toast({
          title: "Account created",
          description: "Your portfolio has been initialized with sample content",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    try {
      storageService.clearUserData();
      setUserData(null);
      console.log('User logged out');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isAuthenticated: !!userData,
        isLoading,
        login,
        logout,
        updateUserData,
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
