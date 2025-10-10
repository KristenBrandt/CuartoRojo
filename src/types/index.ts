export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'weddings' | 'corporate' | 'activations' | 'food-styling' | 'festivals';
  client: string;
  location: string;
  date: string;
  services: string[];
  featured: boolean;
  heroMedia: {
    type: 'image' | 'video';
    url: string;
    poster?: string;
    alt: string;
  };
  gallery: {
    type: 'image' | 'video';
    url: string;
    poster?: string;
    alt: string;
  }[];
  description: string;
  challenges: string;
  solution: string;
  results: string[];
  deliverables: string[];
  embedReel?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  deliverables: string[];
  gallery: {
    type: 'image' | 'video';
    url: string;
    poster?: string;
    alt: string;
  }[];
  icon: string;
  featured: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  projectId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social?: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
  };
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  venue: string;
  serviceType: string;
  budgetRange: string;
  message: string;
}

// Admin Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  is_active: boolean;
}

export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  category: string;           // ← nombre para mostrar (del join)
  category_id?: string | null; // ← FK real para guardar
  short_description: string;
  full_description: string;
  cover_image_url: string | null;
  gallery: ProjectMedia[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  order_index: number;
  tags: string[];
  client_name: string;
  event_date: string | null;
  location: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  type: 'image' | 'video';
  url: string;
  alt_text: string;
  order_index: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: 'admin';
  is_active: boolean;
  send_invite?: boolean;
}

export interface ProjectFilters {
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface DashboardStats {
  total_projects: number;
  published_projects: number;
  draft_projects: number;
  featured_projects: number;
  last_updated: string;
}

export interface RecentActivity {
  id: string;
  user_name: string;
  action: string;
  project_title: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  is_active: boolean;
  project_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryForm {
  name: string;
  description: string;
  color: string;
  is_active: boolean;
}
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social?: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
  };
}

export interface AdminTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  social_behance: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamMemberForm {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_behance?: string;
}