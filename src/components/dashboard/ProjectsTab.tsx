import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storageService, Project } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash, ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProjectsTab: React.FC = () => {
  const { userData, updateUserData } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (userData) {
      setProjects(userData.projects);
    }
  }, [userData]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setCoverImage('');
    setProjectImages([]);
    setCurrentProject(null);
    setEditMode(false);
  };
  
  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setDate(project.date);
    setCoverImage(project.coverImage);
    setProjectImages(project.images);
    setEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteConfirm = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteProject = () => {
    if (!projectToDelete || !userData) return;
    
    try {
      storageService.deleteProject(projectToDelete);
      
      const updatedProjects = projects.filter(p => p.id !== projectToDelete);
      setProjects(updatedProjects);
      
      updateUserData({
        ...userData,
        projects: updatedProjects
      });
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the project.",
        variant: "destructive"
      });
    }
    
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };
  
  const handleSubmit = () => {
    if (!userData) return;
    
    if (!title || !description || !date || !coverImage) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields including a cover image.",
        variant: "destructive"
      });
      return;
    }
    
    const finalProjectImages = projectImages.length > 0 ? projectImages : [coverImage];
    
    try {
      let updatedProject: Project;
      let updatedProjects: Project[];
      
      if (editMode && currentProject) {
        updatedProject = storageService.updateProject(currentProject.id, {
          title,
          description,
          date,
          coverImage,
          images: finalProjectImages
        });
        
        updatedProjects = projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        );
        
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully."
        });
      } else {
        updatedProject = storageService.saveProject({
          title,
          description,
          date,
          coverImage,
          images: finalProjectImages
        });
        
        updatedProjects = [updatedProject, ...projects];
        
        toast({
          title: "Project added",
          description: "Your new project has been added to your portfolio."
        });
      }
      
      setProjects(updatedProjects);
      
      updateUserData({
        ...userData,
        projects: updatedProjects
      });
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your project.",
        variant: "destructive"
      });
    }
  };
  
  const handleSetCoverImage = (imageUrl: string) => {
    setCoverImage(imageUrl);
  };
  
  const handleMultipleImagesUploaded = (imageUrls: string[]) => {
    setProjectImages(imageUrls);
  };

  const handleDummyImageUploaded = (imageUrl: string) => {
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Projects</h2>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Add your first project to showcase your work.</p>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video overflow-hidden bg-muted">
                <img 
                  src={project.coverImage} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteConfirm(project.id)}>
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {project.images.slice(0, 3).map((image, index) => (
                      <div key={index} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                        <img src={image} alt={`Project ${index}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {project.images.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                        +{project.images.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(90vh-180px)]">
            <div className="grid gap-4 py-4 px-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Cover Image</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    This will be the main image shown in your portfolio.
                  </p>
                  <ImageUpload
                    onImageUploaded={handleSetCoverImage}
                    currentImage={coverImage}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Project Gallery</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add multiple images to showcase your project in detail.
                  </p>
                  
                  <ImageUpload
                    multiple
                    onImageUploaded={handleDummyImageUploaded}
                    onMultipleImagesUploaded={handleMultipleImagesUploaded}
                    className="mt-2"
                    maxImages={10}
                  />
                  
                  {projectImages.length > 0 && (
                    <div className="mt-4">
                      <Label>Gallery Preview</Label>
                      <Carousel className="w-full max-w-sm mx-auto mt-2">
                        <CarouselContent>
                          {projectImages.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="p-1">
                                <img
                                  src={image}
                                  alt={`Project image ${index + 1}`}
                                  className="aspect-video object-cover rounded-md w-full"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex justify-center gap-2 mt-2">
                          <CarouselPrevious />
                          <span className="text-sm text-muted-foreground">
                            {projectImages.length} image{projectImages.length !== 1 ? 's' : ''}
                          </span>
                          <CarouselNext />
                        </div>
                      </Carousel>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>{editMode ? 'Update Project' : 'Add Project'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsTab;
