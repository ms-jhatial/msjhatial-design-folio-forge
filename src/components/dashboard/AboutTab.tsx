
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storageService, AboutSection } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ReactMarkdown from 'react-markdown';
import ProfilePreviewModal from './ProfilePreviewModal';

const AboutTab: React.FC = () => {
  const { userData, updateUserData } = useAuth();
  const [about, setAbout] = useState<AboutSection>({
    content: '',
    image: '',
    layout: 'vertical'
  });
  const [preview, setPreview] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    console.log('AboutTab mounted, userData:', userData);
    if (userData) {
      console.log('Setting about data:', userData.about);
      setAbout(userData.about);
    }
  }, [userData]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAbout(prev => ({ ...prev, content: e.target.value }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    console.log('Image uploaded:', imageUrl);
    setAbout(prev => ({ ...prev, image: imageUrl }));
  };

  const handleLayoutChange = (value: string) => {
    setAbout(prev => ({ ...prev, layout: value as 'vertical' | 'horizontal' | 'carousel' }));
  };

  const handleSave = () => {
    try {
      console.log('Saving about data:', about);
      storageService.updateAbout(about);

      // Also update the context
      if (userData) {
        const updatedUserData = {
          ...userData,
          about: about
        };
        updateUserData(updatedUserData);
      }

      toast({
        title: "About section saved",
        description: "Your about section has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving about section:', error);
      toast({
        title: "Error",
        description: "There was an error saving your about section.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <ProfilePreviewModal open={modalOpen} onOpenChange={setModalOpen} about={about} />
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h2 className="text-xl font-semibold">Edit About Section</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            Preview Profile
          </Button>
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {preview ? (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          {about.layout === 'vertical' ? (
            <div>
              {about.image && (
                <div className="mb-4">
                  <img
                    src={about.image}
                    alt="About"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="prose max-w-none">
                <ReactMarkdown>{about.content}</ReactMarkdown>
              </div>
            </div>
          ) : about.layout === 'horizontal' ? (
            <div className="grid md:grid-cols-2 gap-6">
              {about.image && (
                <div>
                  <img
                    src={about.image}
                    alt="About"
                    className="w-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="prose max-w-none">
                <ReactMarkdown>{about.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div>
              {about.image && (
                <div className="mb-4">
                  <img
                    src={about.image}
                    alt="About"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="prose max-w-none">
                <ReactMarkdown>{about.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <Label htmlFor="layout">Layout Style</Label>
            <RadioGroup
              value={about.layout}
              onValueChange={handleLayoutChange}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vertical" id="vertical" />
                <Label htmlFor="vertical" className="cursor-pointer">Vertical</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="horizontal" id="horizontal" />
                <Label htmlFor="horizontal" className="cursor-pointer">Horizontal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="carousel" id="carousel" />
                <Label htmlFor="carousel" className="cursor-pointer">Carousel</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="image">Profile Image</Label>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              currentImage={about.image}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="content">About Content (Supports Markdown)</Label>
            <div className="text-xs text-muted-foreground mb-2">
              You can use Markdown formatting for headings, bold text, links, and more.
            </div>
            <Textarea
              id="content"
              value={about.content}
              onChange={handleContentChange}
              placeholder="Write about yourself, your experience, and your skills..."
              rows={12}
              className="font-mono"
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutTab;

