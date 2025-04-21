
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsTab from '@/components/dashboard/ProjectsTab';
import TimelineTab from '@/components/dashboard/TimelineTab';
import AboutTab from '@/components/dashboard/AboutTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import VideoGalleryTab from '@/components/dashboard/VideoGalleryTab';
import { storageService } from '@/lib/storage';

const Dashboard: React.FC = () => {
  const { isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !userData) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-6">Manage your portfolio, timeline, and settings</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 flex flex-wrap">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-4">
            <ProjectsTab />
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <TimelineTab />
          </TabsContent>

          <TabsContent value="videos" className="mt-4">
            <VideoGalleryTab />
          </TabsContent>

          <TabsContent value="about" className="mt-4">
            <AboutTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
