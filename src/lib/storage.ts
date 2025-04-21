
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  images: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  createdAt: number;
}

export interface AboutSection {
  content: string;
  image: string;
  layout: 'vertical' | 'horizontal' | 'carousel';
}

export interface UserData {
  user: User;
  projects: Project[];
  timeline: TimelineEntry[];
  about: AboutSection;
  layoutPreferences: {
    projectLayout: 'grid' | 'masonry' | 'carousel';
    timelineLayout: 'grid' | 'masonry' | 'carousel';
    showSampleContent: boolean;
  };
}

// Sample data for new users
const sampleData: UserData = {
  user: {
    id: 'sample-user',
    username: 'Demo User',
    email: 'demo@example.com',
    createdAt: Date.now(),
  },
  projects: [
    {
      id: 'sample-project-1',
      title: 'Brand Identity Design',
      description: 'A comprehensive brand identity for a tech startup focusing on sustainable solutions.',
      date: '2023-12-01',
      coverImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      images: [
        'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
        'https://images.unsplash.com/photo-1518770660439-4636190af475'
      ],
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    },
    {
      id: 'sample-project-2',
      title: 'UI/UX for Mobile App',
      description: 'User interface and experience design for a health and wellness mobile application.',
      date: '2023-11-15',
      coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      images: [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
      ],
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
      updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    }
  ],
  timeline: [
    {
      id: 'sample-timeline-1',
      title: 'Graduated Design School',
      description: 'Completed my Bachelor of Arts in Graphic Design with honors.',
      date: '2022-05-15',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      createdAt: Date.now(),
    },
    {
      id: 'sample-timeline-2',
      title: 'First Client Project',
      description: 'Completed my first major client project with excellent feedback.',
      date: '2022-06-30',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      createdAt: Date.now(),
    }
  ],
  about: {
    content: '# About Me\n\nI am a passionate designer with a keen eye for detail and a love for creating meaningful digital experiences. With expertise in UI/UX design, branding, and visual communication, I help businesses connect with their audiences through thoughtful and intentional design.\n\n## My Approach\n\nI believe in user-centered design that not only looks beautiful but also solves real problems. Every project starts with deep research and understanding of the users' needs before moving into the creative process.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    layout: 'vertical'
  },
  layoutPreferences: {
    projectLayout: 'grid',
    timelineLayout: 'masonry',
    showSampleContent: true
  }
};

class StorageService {
  private storageKey = 'msjhatial-design-data';
  
  // Get current user data
  getCurrentUser(): UserData | null {
    const currentUserJson = localStorage.getItem(this.storageKey);
    return currentUserJson ? JSON.parse(currentUserJson) : null;
  }
  
  // Create a new user
  createUser(username: string, email: string): UserData {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      createdAt: Date.now()
    };
    
    const userData: UserData = {
      user: newUser,
      projects: sampleData.projects,
      timeline: sampleData.timeline,
      about: sampleData.about,
      layoutPreferences: sampleData.layoutPreferences
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
    return userData;
  }
  
  // Save user data
  saveUserData(userData: UserData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
  }
  
  // Clear user data (logout)
  clearUserData(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  // Helper to generate unique IDs
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  // Save a new project
  saveProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const userData = this.getCurrentUser();
    if (!userData) throw new Error('No user logged in');
    
    const newProject: Project = {
      ...project,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    userData.projects.unshift(newProject);
    this.saveUserData(userData);
    
    return newProject;
  }
  
  // Update an existing project
  updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Project {
    const userData = this.getCurrentUser();
    if (!userData) throw new Error('No user logged in');
    
    const projectIndex = userData.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');
    
    const updatedProject = {
      ...userData.projects[projectIndex],
      ...updates,
      updatedAt: Date.now()
    };
    
    userData.projects[projectIndex] = updatedProject;
    this.saveUserData(userData);
    
    return updatedProject;
  }
  
  // Delete a project
  deleteProject(projectId: string): void {
    const userData = this.getCurrentUser();
    if (!userData) throw new Error('No user logged in');
    
    userData.projects = userData.projects.filter(p => p.id !== projectId);
    this.saveUserData(userData);
  }
  
  // Timeline entry methods
  saveTimelineEntry(entry: Omit<TimelineEntry, 'id' | 'createdAt'>): TimelineEntry {
    const userData = this.getCurrentUser();
    if (!userData) throw new Error('No user logged in');
    
    const newEntry: TimelineEntry = {
      ...entry,
      id: this.generateId(),
      createdAt: Date.now()
    };
    
    userData.timeline.unshift(newEntry);
    this.saveUserData(userData);
    
    return newEntry;
  }
  
  updateTimelineEntry(entryId: string, updates: Partial<Omit<TimelineEntry, 'id' | 'createdAt'>>): TimelineEntry {
    const userData = this.getCurrentUser();
    if (!userData) throw new Error('No user logged in');
    
    const entryIndex = userData.timeline.findIndex(e => e.id === entryId);
    if (entryIndex === -1) throw new Error('Timeline entry not found');
    
    const updatedEntry = {
      ...userData.timeline[entryIndex],
      ...updates
    };
    
    userData.timeline[entryIndex] = updatedEntry;
    this.saveUserData(userData);
    
    return updatedEntry;
  }
  
  deleteTimelineEntry(entryId: string): void {
    const userData = this.getCurrentUser();
    if (!userData) throw new Error('No user logged in');
    
    userData.timeline = userData.timeline.filter(e => e.id !== entryId);
    this.saveUserData(userData);
  }
  
  // Update About section
  updateAbout(about: AboutSection): void {
    const userData = this.getCurrentUser();
    if (!userData) throw new Error('No user logged in');
    
    userData.about = about;
    this.saveUserData(userData);
  }
  
  // Update layout preferences
  updateLayoutPreferences(preferences: Partial<UserData['layoutPreferences']>): void {
    const userData = this.getCurrentUser();
    if (!userData) throw new Error('No user logged in');
    
    userData.layoutPreferences = {
      ...userData.layoutPreferences,
      ...preferences
    };
    
    this.saveUserData(userData);
  }
  
  // Image upload (to base64)
  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}

export const storageService = new StorageService();
