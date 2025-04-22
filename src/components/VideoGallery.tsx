
import React, { useState } from 'react';
import { Video } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  isLocal?: boolean;
}

interface VideoGalleryProps {
  videos: VideoItem[];
  className?: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, className = '' }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <div className={`w-full ${className}`}>
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No videos yet</h3>
          <p className="text-muted-foreground mb-4">Add videos from the dashboard to showcase your work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => handleVideoClick(video)}
            >
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-primary ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{video.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0">
          {selectedVideo && (
            <>
              <DialogTitle className="p-4 border-b">
                {selectedVideo.title}
              </DialogTitle>
              <div className="p-1 overflow-hidden">
                <div className="aspect-video w-full bg-black">
                  {isYouTubeUrl(selectedVideo.embedUrl) ? (
                    <iframe
                      src={selectedVideo.embedUrl}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : selectedVideo.isLocal ? (
                    <video
                      src={selectedVideo.embedUrl}
                      controls
                      className="w-full h-full"
                      poster={selectedVideo.thumbnailUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <iframe
                      src={selectedVideo.embedUrl}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-muted-foreground">{selectedVideo.description}</p>
                </div>
              </div>
              <DialogClose asChild>
                <button
                  className="absolute top-4 right-4 rounded-full p-2 text-muted-foreground bg-background/80 hover:bg-accent"
                  aria-label="Close"
                >
                  ×
                </button>
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoGallery;
