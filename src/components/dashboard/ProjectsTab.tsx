
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

const ProjectsTab: React.FC = () => {
  const { userData, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Form state
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
    if (!projectToDelete) return;
    
    try {
      storageService.deleteProject(projectToDelete);
      
      // Update local state
      setProjects(prev => prev.filter(p => p.id !== projectToDelete));
      
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
    // Validate form
    if (!title || !description || !date || !coverImage) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields including a cover image.",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure at least one project image (can be the same as cover image)
    const finalProjectImages = projectImages.length > 0 ? projectImages : [coverImage];
    
    try {
      if (editMode && currentProject) {
        // Update existing project
        storageService.updateProject(currentProject.id, {
          title,
          description,
          date,
          coverImage,
          images: finalProjectImages
        });
        
        // Update local state
        setProjects(prev => prev.map(p => 
          p.id === currentProject.id 
            ? { ...p, title, description, date, coverImage, images: finalProjectImages, updatedAt: Date.now() } 
            : p
        ));
        
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully."
        });
      } else {
        // Create new project
        const newProject = storageService.saveProject({
          title,
          description,
          date,
          coverImage,
          images: finalProjectImages
        });
        
        // Update local state
        setProjects(prev => [newProject, ...prev]);
        
        toast({
          title: "Project added",
          description: "Your new project has been added to your portfolio."
        });
      }
      
      // Close dialog and reset form
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
  
  const handleAddImage = (imageUrl: string) => {
    if (imageUrl && !projectImages.includes(imageUrl)) {
      setProjectImages(prev => [...prev, imageUrl]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setProjectImages(prev => prev.filter((_, i) => i !== index));
  };

  // Use cover image as first project image if no other images
  const handleSetCoverImage = (imageUrl: string) => {
    setCoverImage(imageUrl);
    // If it's the first image, also add it to project images
    if (projectImages.length === 0) {
      setProjectImages([imageUrl]);
    }
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
            <div key={project.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={project.coverImage} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.date}</p>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                </div>
                <div className="mt-4 flex justify-between">
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
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteConfirm(project.id)}>
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Project Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
                <ImageUpload
                  onImageUploaded={handleSetCoverImage}
                  currentImage={coverImage}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Project Images</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Add multiple images to showcase your project.
                </p>
                
                {projectImages.length > 0 ? (
                  <div className="mb-6">
                    <Carousel className="w-full max-w-sm mx-auto">
                      <CarouselContent>
                        {projectImages.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative group p-1">
                              <img
                                src={image}
                                alt={`Project image ${index + 1}`}
                                className="aspect-square object-cover rounded-md w-full"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-center items-center gap-2 mt-2">
                        <CarouselPrevious className="relative static transform-none" />
                        <span className="text-sm text-muted-foreground">
                          {projectImages.length} image{projectImages.length !== 1 ? 's' : ''}
                        </span>
                        <CarouselNext className="relative static transform-none" />
                      </div>
                    </Carousel>
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-md mb-4">
                    <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No project images added yet</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <Label htmlFor="addMoreImages">Add More Images</Label>
                  <ImageUpload
                    onImageUploaded={handleAddImage}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>{editMode ? 'Update Project' : 'Add Project'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
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
