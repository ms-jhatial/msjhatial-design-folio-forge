
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsTab from '@/components/dashboard/ProjectsTab';
import TimelineTab from '@/components/dashboard/TimelineTab';
import AboutTab from '@/components/dashboard/AboutTab';
import SettingsTab from '@/components/dashboard/SettingsTab';

const Dashboard: React.FC = () => {
  const { isAuthenticated, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');

  // If not authenticated, redirect to login
  if (!isAuthenticated || !userData) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-6">Manage your portfolio content and settings</p>

        <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <ProjectsTab />
          </TabsContent>
          
          <TabsContent value="timeline">
            <TimelineTab />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
