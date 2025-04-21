
import React, { useState } from 'react';
import { Project } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = '' }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
    );
  };

  const formattedDate = (() => {
    try {
      return format(new Date(project.date), 'MMMM yyyy');
    } catch (e) {
      return project.date;
    }
  })();

  return (
    <>
      <div 
        className={`group relative overflow-hidden rounded-lg shadow-md hover-scale ${className}`}
        onClick={() => setShowModal(true)}
      >
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <h3 className="text-white font-semibold text-lg">{project.title}</h3>
          <p className="text-white/80 text-sm mt-1">{formattedDate}</p>
        </div>
      </div>
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>{project.title}</DialogTitle>
            <DialogDescription>{formattedDate}</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="relative">
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} - image ${currentImageIndex + 1}`}
                className="w-full rounded-md object-contain max-h-[60vh]"
              />
              
              {project.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-8 w-8 p-0"
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  >
                    &lt;
                  </Button>
                  <Button
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-8 w-8 p-0"
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  >
                    &gt;
                  </Button>
                </>
              )}
            </div>
            
            {project.images.length > 1 && (
              <div className="flex justify-center mt-2 space-x-1">
                {project.images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'w-6 bg-brand-purple' : 'w-1.5 bg-gray-300'
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
            
            <p className="mt-4 text-muted-foreground">{project.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
