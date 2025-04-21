
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

interface ProfilePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  about: { content: string; image?: string; layout?: string };
}

const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
  open,
  onOpenChange,
  about,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 md:max-w-2xl bg-background z-[999]">
        <DialogHeader>
          <DialogTitle className="text-center w-full">Profile Preview</DialogTitle>
        </DialogHeader>
        <div className="p-6 w-full">
          {about.image && (
            <div className="mb-4 flex justify-center">
              <img
                src={about.image}
                alt="Profile"
                className="w-full max-w-xs max-h-64 object-cover rounded-lg shadow"
              />
            </div>
          )}
          <div className="prose max-w-none">
            <ReactMarkdown>{about.content}</ReactMarkdown>
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
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePreviewModal;
