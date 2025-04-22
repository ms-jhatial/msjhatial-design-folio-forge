
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProjectCard from '@/components/ProjectCard';
import VideoGallery, { VideoItem } from '@/components/VideoGallery';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, LayoutList, Bookmark, Grid3X3 } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { userData, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  const [activeTab, setActiveTab] = useState<'projects' | 'videos'>('projects');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  
  useEffect(() => {
    if (userData) {
      setProjects(userData.projects);
      if (userData.videos && userData.videos.length > 0) {
        setVideos(userData.videos);
      }
      setLayout(userData.layoutPreferences.projectLayout === 'carousel' 
        ? 'grid' 
        : userData.layoutPreferences.projectLayout);
    }
  }, [userData]);
  
  if (!userData && !isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground mb-6">Please log in to view and manage your portfolio.</p>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground mt-1">Showcase of my work and projects</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'projects' | 'videos')} 
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Projects</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <span>Videos</span>
                </TabsTrigger>
              </TabsList>
            
              <TabsContent value="projects" className="pt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">My Projects</h2>
                  <div className="flex space-x-2">
                    <Button 
                      variant={layout === 'grid' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setLayout('grid')}
                      className="flex items-center gap-2"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only">Grid</span>
                    </Button>
                    <Button 
                      variant={layout === 'masonry' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setLayout('masonry')}
                      className="flex items-center gap-2"
                    >
                      <Grid3X3 className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only">Masonry</span>
                    </Button>
                  </div>
                </div>
                
                {projects.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                    <p className="text-muted-foreground mb-6">Add your first project from the dashboard.</p>
                    <Link to="/dashboard">
                      <Button>Go to Dashboard</Button>
                    </Link>
                  </div>
                ) : layout === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {projects.map((project) => (
                      <div key={project.id} className="break-inside-avoid">
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="videos" className="pt-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">My Videos</h2>
                  <p className="text-muted-foreground">Video presentations and demonstrations</p>
                </div>
                <VideoGallery videos={videos} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;
