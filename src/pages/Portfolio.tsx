
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProjectCard from '@/components/ProjectCard';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Portfolio: React.FC = () => {
  const { userData, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  
  useEffect(() => {
    if (userData) {
      setProjects(userData.projects);
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
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant={layout === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setLayout('grid')}
            >
              Grid
            </Button>
            <Button 
              variant={layout === 'masonry' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setLayout('masonry')}
            >
              Masonry
            </Button>
          </div>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
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
      </div>
    </Layout>
  );
};

export default Portfolio;
