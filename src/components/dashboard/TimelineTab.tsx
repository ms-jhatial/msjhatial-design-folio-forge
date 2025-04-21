
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storageService, TimelineEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash } from 'lucide-react';
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

const TimelineTab: React.FC = () => {
  const { userData } = useAuth();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimelineEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (userData) {
      // Sort entries by date, newest first
      const sortedEntries = [...userData.timeline].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setEntries(sortedEntries);
    }
  }, [userData]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setImage('');
    setCurrentEntry(null);
    setEditMode(false);
  };
  
  const handleEditEntry = (entry: TimelineEntry) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setDescription(entry.description);
    setDate(entry.date);
    setImage(entry.image);
    setEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteConfirm = (entryId: string) => {
    setEntryToDelete(entryId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteEntry = () => {
    if (!entryToDelete) return;
    
    try {
      storageService.deleteTimelineEntry(entryToDelete);
      
      // Update local state
      setEntries(prev => prev.filter(e => e.id !== entryToDelete));
      
      toast({
        title: "Entry deleted",
        description: "The timeline entry has been successfully deleted."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the timeline entry.",
        variant: "destructive"
      });
    }
    
    setIsDeleteDialogOpen(false);
    setEntryToDelete(null);
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!title || !description || !date || !image) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editMode && currentEntry) {
        // Update existing entry
        storageService.updateTimelineEntry(currentEntry.id, {
          title,
          description,
          date,
          image
        });
        
        // Update local state
        setEntries(prev => prev.map(e => 
          e.id === currentEntry.id 
            ? { ...e, title, description, date, image } 
            : e
        ));
        
        toast({
          title: "Entry updated",
          description: "Your timeline entry has been updated successfully."
        });
      } else {
        // Create new entry
        const newEntry = storageService.saveTimelineEntry({
          title,
          description,
          date,
          image
        });
        
        // Update local state
        setEntries(prev => [newEntry, ...prev]);
        
        toast({
          title: "Entry added",
          description: "Your new timeline entry has been added."
        });
      }
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your timeline entry.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Timeline</h2>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Entry
        </Button>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No timeline entries yet</h3>
          <p className="text-muted-foreground mb-4">Add your first timeline entry to showcase your journey.</p>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/4 aspect-video md:aspect-square overflow-hidden">
                <img 
                  src={entry.image} 
                  alt={entry.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 md:w-3/4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground">{entry.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditEntry(entry)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteConfirm(entry.id)}>
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm line-clamp-2">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Timeline Entry Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Timeline Entry' : 'Add Timeline Entry'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
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
                placeholder="Describe this timeline event"
                rows={4}
              />
            </div>
            
            <div>
              <Label>Image</Label>
              <ImageUpload
                onImageUploaded={setImage}
                currentImage={image}
                className="mt-2"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>{editMode ? 'Update Entry' : 'Add Entry'}</Button>
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
              timeline entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TimelineTab;
