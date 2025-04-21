
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProjectCard from '@/components/ProjectCard';
import TimelineEntry from '@/components/TimelineEntry';
import ReactMarkdown from 'react-markdown';

const Index: React.FC = () => {
  const { userData, isAuthenticated } = useAuth();

  // Get up to 3 recent projects and timeline entries
  const projects = userData?.projects?.slice(0, 3) || [];
  const timelineEntries = userData?.timeline
    ?.slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3) || [];
  const about = userData?.about;

  return (
    <Layout>
      {/* Hero section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-brand-light to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Build your design portfolio with ease
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create, customize, and showcase your best work with
              <span className="text-brand-purple font-semibold"> msjhatial design</span>'s
              intuitive portfolio builder.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link to="/portfolio">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      View Portfolio
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/portfolio">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      View Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Show uploaded user content previews */}
      {isAuthenticated && userData && (
        <section className="py-16 bg-background border-t border-b">
          <div className="container mx-auto px-4 flex flex-col gap-16">
            {/* About Section Preview */}
            {about && (about.content || about.image) && (
              <div className="flex flex-col md:flex-row items-center md:gap-8 gap-6">
                {about.image && (
                  <div className="w-full md:w-64 flex-shrink-0 mb-4 md:mb-0 flex justify-center">
                    <img
                      src={
                        typeof about.image === "string"
                          ? about.image
                          : // fallback for old data structure
                            (about.image?.value || "")
                      }
                      alt="Profile"
                      className="rounded-lg object-cover w-40 h-40 md:w-56 md:h-56 shadow"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">About Me</h2>
                  <div className="prose max-w-none prose-sm md:prose-lg line-clamp-6">
                    <ReactMarkdown>{about.content}</ReactMarkdown>
                  </div>
                  <div className="mt-4">
                    <Link to="/about">
                      <Button size="sm" variant="outline">
                        View Full About
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Projects Preview */}
            {projects && projects.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Recent Projects</h2>
                  <Link to="/portfolio">
                    <Button size="sm" variant="outline">View All</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Entries Preview */}
            {timelineEntries && timelineEntries.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">My Timeline</h2>
                  <Link to="/timeline">
                    <Button size="sm" variant="outline">View Full Timeline</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {timelineEntries.map((entry) => (
                    <TimelineEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Feature-Rich Portfolio Builder</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create a stunning design portfolio, all in your browser.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Gallery</h3>
              <p className="text-muted-foreground">
                Showcase your projects with beautiful galleries and detailed modal views.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Timeline View</h3>
              <p className="text-muted-foreground">
                Create an interactive timeline to showcase your career journey and achievements.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Layouts</h3>
              <p className="text-muted-foreground">
                Choose from multiple layout options for both your projects and timeline sections.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Browser-based section */}
      <section className="py-20 bg-brand-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">100% Browser-Based</h2>
              <p className="text-gray-300 mb-6">
                No servers, no databases, no hassle. Your portfolio is created and stored entirely in your browser, 
                giving you complete control over your data.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-brand-purple mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Local storage keeps your data secure
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-brand-purple mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No account creation required
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-brand-purple mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Works offline after initial load
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-brand-purple mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fast and responsive experience
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
                  alt="Browser-based portfolio"
                  className="rounded-md w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to build your portfolio?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started with msjhatial design's portfolio builder today. No sign up required.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
              Start Building Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

