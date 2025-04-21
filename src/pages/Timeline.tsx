
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TimelineEntryComponent from '@/components/TimelineEntry';
import { useAuth } from '@/context/AuthContext';
import { TimelineEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Timeline: React.FC = () => {
  const { userData, isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [layout, setLayout] = useState<'grid' | 'masonry'>('masonry');
  
  useEffect(() => {
    if (userData) {
      // Sort entries by date, newest first
      const sortedEntries = [...userData.timeline].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setEntries(sortedEntries);
      setLayout(userData.layoutPreferences.timelineLayout === 'carousel' 
        ? 'grid' 
        : userData.layoutPreferences.timelineLayout);
    }
  }, [userData]);
  
  if (!userData && !isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Timeline</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your timeline.</p>
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
            <h1 className="text-3xl font-bold">Timeline</h1>
            <p className="text-muted-foreground mt-1">My journey and milestones</p>
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
        
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No timeline entries yet</h2>
            <p className="text-muted-foreground mb-6">Add your first timeline entry from the dashboard.</p>
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <TimelineEntryComponent key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="break-inside-avoid">
                <TimelineEntryComponent entry={entry} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
