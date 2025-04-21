
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Upload, X } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImage,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await storageService.uploadImage(file);
      setPreviewUrl(imageUrl);
      onImageUploaded(imageUrl);
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUploaded('');
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="sr-only"
        accept="image/*"
      />
      
      {previewUrl ? (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Change
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-full min-h-32 flex flex-col items-center justify-center border-dashed"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          <Image className="h-8 w-8 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">
            {isUploading ? 'Uploading...' : 'Upload image'}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            JPG, PNG, GIF up to 5MB
          </span>
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
