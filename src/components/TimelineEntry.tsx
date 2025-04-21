
import React, { useState } from 'react';
import { TimelineEntry as TimelineEntryType } from '@/lib/storage';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface TimelineEntryProps {
  entry: TimelineEntryType;
  className?: string;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ entry, className = '' }) => {
  const [showModal, setShowModal] = useState(false);

  const formattedDate = (() => {
    try {
      return format(new Date(entry.date), 'MMMM d, yyyy');
    } catch (e) {
      return entry.date;
    }
  })();

  return (
    <>
      <div 
        className={`group relative overflow-hidden rounded-lg shadow-md hover-scale ${className}`}
        onClick={() => setShowModal(true)}
      >
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={entry.image}
            alt={entry.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
          <h3 className="text-white font-semibold text-lg">{entry.title}</h3>
          <p className="text-white/80 text-sm mt-1">{formattedDate}</p>
        </div>
      </div>
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>{entry.title}</DialogTitle>
            <DialogDescription>{formattedDate}</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <img
              src={entry.image}
              alt={entry.title}
              className="w-full rounded-md object-contain max-h-[50vh]"
            />
            
            <p className="mt-4 text-muted-foreground">{entry.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimelineEntry;
