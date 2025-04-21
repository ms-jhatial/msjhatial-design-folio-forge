
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storageService } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SettingsTab: React.FC = () => {
  const { userData, logout } = useAuth();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    username: '',
    email: '',
    projectLayout: 'grid' as 'grid' | 'masonry' | 'carousel',
    timelineLayout: 'masonry' as 'grid' | 'masonry' | 'carousel',
    showSampleContent: true
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (userData) {
      setSettings({
        username: userData.user.username,
        email: userData.user.email,
        projectLayout: userData.layoutPreferences.projectLayout,
        timelineLayout: userData.layoutPreferences.timelineLayout,
        showSampleContent: userData.layoutPreferences.showSampleContent
      });
    }
  }, [userData]);
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, username: e.target.value }));
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, email: e.target.value }));
  };
  
  const handleProjectLayoutChange = (value: string) => {
    setSettings(prev => ({ ...prev, projectLayout: value as 'grid' | 'masonry' | 'carousel' }));
  };
  
  const handleTimelineLayoutChange = (value: string) => {
    setSettings(prev => ({ ...prev, timelineLayout: value as 'grid' | 'masonry' | 'carousel' }));
  };
  
  const handleSampleContentChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, showSampleContent: checked }));
  };
  
  const handleSaveSettings = () => {
    try {
      if (userData) {
        // Update user info
        const updatedUserData = {
          ...userData,
          user: {
            ...userData.user,
            username: settings.username,
            email: settings.email
          },
          layoutPreferences: {
            projectLayout: settings.projectLayout,
            timelineLayout: settings.timelineLayout,
            showSampleContent: settings.showSampleContent
          }
        };
        
        storageService.saveUserData(updatedUserData);
        
        toast({
          title: "Settings saved",
          description: "Your settings have been updated successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings.",
        variant: "destructive"
      });
    }
  };
  
  const handleResetPortfolio = () => {
    logout();
    setIsResetDialogOpen(false);
    
    toast({
      title: "Portfolio reset",
      description: "Your portfolio has been reset. You've been logged out."
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Settings</h2>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
      
      <div className="space-y-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                value={settings.username}
                onChange={handleUsernameChange}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={handleEmailChange}
              />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Layout Preferences</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="projectLayout" className="block mb-2">Projects Layout</Label>
              <RadioGroup
                value={settings.projectLayout}
                onValueChange={handleProjectLayoutChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grid" id="projectGrid" />
                  <Label htmlFor="projectGrid" className="cursor-pointer">Grid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masonry" id="projectMasonry" />
                  <Label htmlFor="projectMasonry" className="cursor-pointer">Masonry</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="carousel" id="projectCarousel" />
                  <Label htmlFor="projectCarousel" className="cursor-pointer">Carousel</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="timelineLayout" className="block mb-2">Timeline Layout</Label>
              <RadioGroup
                value={settings.timelineLayout}
                onValueChange={handleTimelineLayoutChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grid" id="timelineGrid" />
                  <Label htmlFor="timelineGrid" className="cursor-pointer">Grid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masonry" id="timelineMasonry" />
                  <Label htmlFor="timelineMasonry" className="cursor-pointer">Masonry</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="carousel" id="timelineCarousel" />
                  <Label htmlFor="timelineCarousel" className="cursor-pointer">Carousel</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showSampleContent"
                checked={settings.showSampleContent}
                onCheckedChange={handleSampleContentChange}
              />
              <Label htmlFor="showSampleContent" className="cursor-pointer">Show Sample Content</Label>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 border-destructive/20">
          <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
          
          <p className="text-muted-foreground mb-4">
            Resetting your portfolio will remove all your data and log you out. This action cannot be undone.
          </p>
          
          <Button variant="destructive" onClick={() => setIsResetDialogOpen(true)}>
            Reset Portfolio
          </Button>
        </div>
      </div>
      
      {/* Reset Confirmation Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your portfolio
              data and reset your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPortfolio}>Reset Portfolio</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsTab;
