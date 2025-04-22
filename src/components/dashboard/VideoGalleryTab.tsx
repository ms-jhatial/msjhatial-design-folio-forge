
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storageService, VideoItem } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { Video, Edit, Trash, Plus, Link } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import VideoGallery from '../VideoGallery';

const VideoGalleryTab = () => {
  const { userData, updateUserData } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [localVideo, setLocalVideo] = useState<File | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLocal, setIsLocal] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (userData) {
      setVideos(userData.videos || []);
    }
  }, [userData]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEmbedUrl('');
    setThumbnailUrl('');
    setIsLocal(false);
    setLocalVideo(null);
    setCurrentVideo(null);
    setEditMode(false);
  };
  
  const handleEditVideo = (video: VideoItem) => {
    setCurrentVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setEmbedUrl(video.embedUrl);
    setThumbnailUrl(video.thumbnailUrl);
    setIsLocal(video.isLocal || false);
    setEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteConfirm = (videoId: string) => {
    setVideoToDelete(videoId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteVideo = () => {
    if (!videoToDelete || !userData) return;
    
    try {
      const updatedVideos = videos.filter(v => v.id !== videoToDelete);
      setVideos(updatedVideos);
      
      // Update in userData
      const updatedUserData = {
        ...userData,
        videos: updatedVideos
      };
      
      updateUserData(updatedUserData);
      storageService.updateVideos(updatedVideos);
      
      toast({
        title: "Video deleted",
        description: "The video has been removed from your gallery."
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "Failed to delete the video.",
        variant: "destructive"
      });
    }
    
    setIsDeleteDialogOpen(false);
    setVideoToDelete(null);
  };
  
  const handleLocalVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 50MB)
    const maxSizeInBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }
    
    setLocalVideo(file);
    setIsLocal(true);
    toast({
      title: "Video selected",
      description: "Video selected for upload."
    });
  };
  
  const handleSubmit = async () => {
    if (!userData) return;
    
    // Validate form
    if (!title || !description || (!embedUrl && !localVideo) || !thumbnailUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      let finalEmbedUrl = embedUrl;
      
      // If it's a local video, convert it to base64
      if (isLocal && localVideo) {
        finalEmbedUrl = await storageService.uploadVideo(localVideo);
      }
      
      const newVideo: VideoItem = {
        id: currentVideo?.id || storageService.generateId(),
        title,
        description,
        embedUrl: finalEmbedUrl,
        thumbnailUrl,
        isLocal
      };
      
      let updatedVideos: VideoItem[];
      
      if (editMode && currentVideo) {
        // Update existing video
        updatedVideos = videos.map(v => v.id === currentVideo.id ? newVideo : v);
      } else {
        // Add new video
        updatedVideos = [newVideo, ...videos];
      }
      
      setVideos(updatedVideos);
      
      // Update in userData
      const updatedUserData = {
        ...userData,
        videos: updatedVideos
      };
      
      updateUserData(updatedUserData);
      storageService.updateVideos(updatedVideos);
      
      toast({
        title: editMode ? "Video updated" : "Video added",
        description: editMode ? "Your video has been updated." : "Your video has been added to the gallery."
      });
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "Error",
        description: "There was an error saving your video.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Videos</h2>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Video
        </Button>
      </div>
      
      <VideoGallery videos={videos} />
      
      {/* Video Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Video' : 'Add Video'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this video"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="videoType"
                checked={isLocal}
                onCheckedChange={setIsLocal}
              />
              <Label htmlFor="videoType">Upload local video file</Label>
            </div>
            
            {isLocal ? (
              <div>
                <Label htmlFor="videoFile">Video File</Label>
                <div className="mt-2">
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={handleLocalVideoUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    MP4, WebM or MOV format, up to 50MB
                  </p>
                </div>
                {localVideo && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    Selected: {localVideo.name} ({Math.round(localVideo.size / 1024 / 1024 * 10) / 10} MB)
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor="embedUrl">Video URL</Label>
                <div className="relative mt-1">
                  <Input
                    id="embedUrl"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/embed/videoID"
                    className="pl-9"
                  />
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  YouTube embed URL or other iframe compatible video source
                </p>
              </div>
            )}
            
            <div>
              <Label htmlFor="thumbnailImage">Thumbnail Image</Label>
              <ImageUpload
                onImageUploaded={setThumbnailUrl}
                currentImage={thumbnailUrl}
                className="mt-2"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>{editMode ? 'Update Video' : 'Add Video'}</Button>
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
              video from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVideo}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VideoGalleryTab;
