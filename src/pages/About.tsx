
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { AboutSection } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const About: React.FC = () => {
  const { userData, isAuthenticated } = useAuth();
  const [about, setAbout] = useState<AboutSection | null>(null);

  useEffect(() => {
    if (userData) {
      setAbout(userData.about);
    }
  }, [userData]);

  if (!userData && !isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">About</h1>
          <p className="text-muted-foreground mb-6">Please log in to view the about section.</p>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!about) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">About</h1>
          <p className="text-muted-foreground mb-6">No about section has been created yet.</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">About</h1>

        {about.layout === 'vertical' ? (
          <div className="max-w-4xl mx-auto">
            {about.image && (
              <div className="mb-8">
                <img
                  src={about.image}
                  alt="About"
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
              <ReactMarkdown>{about.content}</ReactMarkdown>
            </div>
          </div>
        ) : about.layout === 'horizontal' ? (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            {about.image && (
              <div>
                <img
                  src={about.image}
                  alt="About"
                  className="w-full object-cover rounded-lg"
                />
              </div>
            )}
            <div className="prose prose-sm md:prose-base max-w-none">
              <ReactMarkdown>{about.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          // Carousel layout - simplified version
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              {about.image && (
                <img
                  src={about.image}
                  alt="About"
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              )}
            </div>
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
              <ReactMarkdown>{about.content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default About;
