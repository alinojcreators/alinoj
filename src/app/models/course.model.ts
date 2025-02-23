export interface Course {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  level: string;
  duration: string;
  language: string;
  highlights: string[];
  syllabus: {
    title: string;
    topics: string[];
  }[];
  projects?: {
    title: string;
    description: string;
  }[];
  price: number;
  instructor: {
    name: string;
    title: string;
    bio: string;
    image: string;
  };
  targetAudience?: string[];
  schedule?: {
    duration: string;
    sessionsPerWeek: number;
    sessionDuration: string;
    batchTypes: string[];
  };
  image?: string;
}