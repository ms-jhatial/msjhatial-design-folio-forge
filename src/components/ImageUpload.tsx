
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Upload, X, Plus, FileImage } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
  multiple?: boolean;
  onMultipleImagesUploaded?: (imageUrls: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImage,
  className = '',
  multiple = false,
  onMultipleImagesUploaded,
  maxImages = 10
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const [multiplePreviewUrls, setMultiplePreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const validateFile = (file: File): boolean => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return false;
    }

    // Validate file size (max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSingleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(25);
      console.log('Uploading image:', file.name);
      
      setTimeout(() => setUploadProgress(50), 500);
      
      const imageUrl = await storageService.uploadImage(file);
      
      setUploadProgress(90);
      console.log('Image uploaded successfully, URL length:', imageUrl.length);
      
      setPreviewUrl(imageUrl);
      onImageUploaded(imageUrl);
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleMultipleFileUpload = async (files: FileList) => {
    if (!onMultipleImagesUploaded) return;
    
    // Convert FileList to array for easier processing
    const fileArray = Array.from(files);
    
    // Check max images limit
    if (fileArray.length > maxImages) {
      toast({
        title: "Too many files",
        description: `Please select a maximum of ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate all files first
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length === 0) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      console.log(`Uploading ${validFiles.length} images`);
      
      const uploadPromises = validFiles.map(file => storageService.uploadImage(file));
      
      setUploadProgress(30);
      
      // Process in batches to not block the UI
      const results: string[] = [];
      const batchSize = 3;
      
      for (let i = 0; i < uploadPromises.length; i += batchSize) {
        const batch = uploadPromises.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
        
        // Update progress
        const progressPercent = Math.min(90, 30 + (60 * (i + batch.length) / uploadPromises.length));
        setUploadProgress(progressPercent);
      }
      
      setMultiplePreviewUrls(results);
      onMultipleImagesUploaded(results);
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
      
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${results.length} images.`,
      });
    } catch (error) {
      console.error('Multiple upload failed:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple && files.length > 1 && onMultipleImagesUploaded) {
      await handleMultipleFileUpload(files);
    } else {
      await handleSingleFileUpload(files[0]);
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
    console.log('Image removed');
  };
  
  const handleRemoveMultipleImage = (index: number) => {
    if (!onMultipleImagesUploaded) return;
    
    const updatedUrls = [...multiplePreviewUrls];
    updatedUrls.splice(index, 1);
    setMultiplePreviewUrls(updatedUrls);
    onMultipleImagesUploaded(updatedUrls);
  };

  // Display progress overlay if uploading
  const renderProgressOverlay = () => {
    if (!isUploading || uploadProgress === 0) return null;
    
    return (
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 rounded-md">
        <div className="w-4/5 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-white text-sm mt-2">Uploading... {Math.floor(uploadProgress)}%</p>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="sr-only"
        accept="image/*"
        multiple={multiple}
      />
      
      {multiple && onMultipleImagesUploaded ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {multiplePreviewUrls.map((url, index) => (
              <div key={index} className="relative group h-24 w-24 overflow-hidden rounded-md border border-border">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveMultipleImage(index)}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {/* Add more button */}
            {multiplePreviewUrls.length > 0 && multiplePreviewUrls.length < maxImages && (
              <button
                className="h-24 w-24 flex flex-col items-center justify-center border border-dashed border-muted-foreground rounded-md hover:bg-accent transition-colors"
                onClick={handleButtonClick}
                disabled={isUploading}
                type="button"
              >
                <Plus className="h-6 w-6 mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add More</span>
              </button>
            )}
          </div>
          
          {multiplePreviewUrls.length === 0 && (
            <Button
              variant="outline"
              className="w-full h-32 flex flex-col items-center justify-center border-dashed"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              <FileImage className="h-8 w-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                Select up to {maxImages} images
              </span>
            </Button>
          )}
          
          {renderProgressOverlay()}
        </div>
      ) : (
        // Single image upload
        <div className="relative">
          {previewUrl ? (
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="w-full h-full max-h-[300px] object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row space-x-2'}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={handleButtonClick}
                    disabled={isUploading}
                    type="button"
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
                    type="button"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
              {renderProgressOverlay()}
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full h-full min-h-32 flex flex-col items-center justify-center border-dashed"
              onClick={handleButtonClick}
              disabled={isUploading}
              type="button"
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
      )}
    </div>
  );
};

export default ImageUpload;
