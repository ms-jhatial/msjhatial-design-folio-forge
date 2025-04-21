
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storageService, VideoItem } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash, Video, Link as LinkIcon } from 'lucide-react';
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

const VideoGalleryTab: React.FC = () => {
  const { userData } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (userData && userData.videos) {
      setVideos(userData.videos);
    } else {
      // Initialize with sample videos if user has none
      const sampleVideos = [
        {
          id: 'video-1',
          title: 'Brand Identity Showcase',
          description: 'A video presentation of our recent brand identity project, showcasing the design process and final deliverables.',
          embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnailUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
        },
        {
          id: 'video-2',
          title: 'UI/UX Design Process',
          description: 'A walkthrough of our design process for mobile applications, from wireframing to final implementation.',
          embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnailUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d',
        }
      ];
      setVideos(sampleVideos);
      // Save the sample videos to user data
      if (userData) {
        storageService.updateVideos(sampleVideos);
      }
    }
  }, [userData]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEmbedUrl('');
    setThumbnailUrl('');
    setCurrentVideo(null);
    setEditMode(false);
  };
  
  const handleEditVideo = (video: VideoItem) => {
    setCurrentVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setEmbedUrl(video.embedUrl);
    setThumbnailUrl(video.thumbnailUrl);
    setEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteConfirm = (videoId: string) => {
    setVideoToDelete(videoId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteVideo = () => {
    if (!videoToDelete) return;
    
    try {
      const updatedVideos = videos.filter(v => v.id !== videoToDelete);
      setVideos(updatedVideos);
      storageService.updateVideos(updatedVideos);
      
      toast({
        title: "Video deleted",
        description: "The video has been successfully deleted."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the video.",
        variant: "destructive"
      });
    }
    
    setIsDeleteDialogOpen(false);
    setVideoToDelete(null);
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!title || !description || !embedUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in title, description, and embed URL.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editMode && currentVideo) {
        // Update existing video
        const updatedVideos = videos.map(v => 
          v.id === currentVideo.id 
            ? { ...v, title, description, embedUrl, thumbnailUrl } 
            : v
        );
        
        setVideos(updatedVideos);
        storageService.updateVideos(updatedVideos);
        
        toast({
          title: "Video updated",
          description: "Your video has been updated successfully."
        });
      } else {
        // Create new video
        const newVideo: VideoItem = {
          id: `video-${Date.now()}`,
          title,
          description,
          embedUrl,
          thumbnailUrl
        };
        
        const updatedVideos = [newVideo, ...videos];
        setVideos(updatedVideos);
        storageService.updateVideos(updatedVideos);
        
        toast({
          title: "Video added",
          description: "Your new video has been added to your gallery."
        });
      }
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your video.",
        variant: "destructive"
      });
    }
  };
  
  // Function to extract YouTube video ID
  const extractYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Handle YouTube URL paste to convert to embed URL
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const videoId = extractYoutubeVideoId(url);
    
    if (videoId) {
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
      // If no thumbnail is set, try to set a YouTube thumbnail
      if (!thumbnailUrl) {
        setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
      }
    } else {
      setEmbedUrl(url);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Video Gallery</h2>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Video
        </Button>
      </div>
      
      {videos.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No videos yet</h3>
          <p className="text-muted-foreground mb-4">Add your first video to showcase your work.</p>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Video
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-video overflow-hidden relative group">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-primary ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditVideo(video)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteConfirm(video.id)}>
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Video Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Video' : 'Add New Video'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Video Title</Label>
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
                placeholder="Describe your video"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <div className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="youtubeUrl"
                  placeholder="Paste YouTube URL (will be converted to embed URL)"
                  onChange={handleYoutubeUrlChange}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Paste a YouTube video URL to automatically generate the embed URL
              </p>
            </div>
            
            <div>
              <Label htmlFor="embedUrl">Embed URL</Label>
              <Input
                id="embedUrl"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The embed URL for your video (automatically generated from YouTube URL)
              </p>
            </div>
            
            <div>
              <Label>Thumbnail</Label>
              <ImageUpload
                onImageUploaded={setThumbnailUrl}
                currentImage={thumbnailUrl}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Custom thumbnail for your video (if not provided, YouTube thumbnail will be used)
              </p>
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
