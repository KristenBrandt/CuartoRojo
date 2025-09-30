import { supabase } from '@/integrations/supabase/client';
import { 
  AdminProject, 
  User, 
  DashboardStats, 
  RecentActivity, 
  ProjectFilters,
  CreateUserForm,
  LoginForm,
  AuthUser,
  Category,
  CreateCategoryForm
} from '@/types';

export const authService = {
  async login(credentials: LoginForm): Promise<{ user: AuthUser; token: string }> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // });
    // return response.json();
    
    // Placeholder implementation
    if (credentials.email === 'admin@cuartorojo.com' && credentials.password === 'Admin123!') {
      return {
        user: { id: '1', email: credentials.email, name: 'Admin User', role: 'admin' },
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Invalid credentials');
  },

  async logout(): Promise<void> {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
  },

  async forgotPassword(email: string): Promise<void> {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/auth/forgot`, {
    //   method: 'POST',
    //   body: JSON.stringify({ email })
    // });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/auth/reset`, {
    //   method: 'POST',
    //   body: JSON.stringify({ token, password })
    // });
  }
};

export const projectsService = {
  async getProjects(filters?: ProjectFilters): Promise<AdminProject[]> {
    let query = supabase
      .from('projects')
      .select(`
        *,
        category:categories(name),
        media:project_media(*)
      `)
      .order('order_index', { ascending: false });

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map((project: any) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category?.name || 'Sin categoría',
      short_description: project.description || '',
      full_description: project.content || '',
      cover_image_url: project.cover_image,
      gallery: project.media || [],
      status: project.status,
      is_featured: project.featured,
      order_index: project.order_index,
      tags: project.tags || [],
      client_name: project.client || '',
      event_date: project.date,
      location: project.location || '',
      created_at: project.created_at,
      updated_at: project.updated_at,
      published_at: project.status === 'published' ? project.updated_at : null
    }));
  },

  async getProject(id: string): Promise<AdminProject> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        category:categories(name),
        media:project_media(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      category: data.category?.name || 'Sin categoría',
      short_description: data.description || '',
      full_description: data.content || '',
      cover_image_url: data.cover_image,
      gallery: data.media || [],
      status: data.status,
      is_featured: data.featured,
      order_index: data.order_index,
      tags: data.tags || [],
      client_name: data.client || '',
      event_date: data.date,
      location: data.location || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      published_at: data.status === 'published' ? data.updated_at : null
    };
  },

  async createProject(project: Partial<AdminProject>): Promise<AdminProject> {
    const slug = project.slug || project.title?.toLowerCase().replace(/\s+/g, '-') || '';
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title || '',
        slug,
        description: project.short_description,
        content: project.full_description,
        category_id: null, // TODO: Map category name to ID
        client: project.client_name,
        date: project.event_date,
        location: project.location,
        cover_image: project.cover_image_url,
        status: project.status || 'draft',
        featured: project.is_featured || false,
        order_index: project.order_index || 0,
        tags: project.tags || []
      })
      .select()
      .single();

    if (error) throw error;

    return this.getProject(data.id);
  },

  async updateProject(id: string, project: Partial<AdminProject>): Promise<AdminProject> {
    const { error } = await supabase
      .from('projects')
      .update({
        title: project.title,
        slug: project.slug,
        description: project.short_description,
        content: project.full_description,
        client: project.client_name,
        date: project.event_date,
        location: project.location,
        cover_image: project.cover_image_url,
        status: project.status,
        featured: project.is_featured,
        order_index: project.order_index,
        tags: project.tags
      })
      .eq('id', id);

    if (error) throw error;

    return this.getProject(id);
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorderProjects(projects: { id: string; order_index: number }[]): Promise<void> {
    for (const project of projects) {
      const { error } = await supabase
        .from('projects')
        .update({ order_index: project.order_index })
        .eq('id', project.id);

      if (error) throw error;
    }
  },

  async uploadMedia(file: File): Promise<{ url: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('project-media')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  }
};

export const usersService = {
  async getUsers(): Promise<User[]> {
    // Use a proper view or explicit join
    const { data, error } = await supabase
      .from('app_users_v') // sql view
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []).map((u: any) => ({
      id: u.id,
      name: u.name || u.email,
      email: u.email,
      role: u.role,              // always 'admin' for new users
      created_at: u.created_at,
      updated_at: u.updated_at ?? null, 
      is_active: u.is_active ?? true,
    }));
  },

  async createUser(user: { name: string; email: string; password: string; is_active?: boolean }): Promise<User> {
    // Must go through your API route that uses the service key
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'create', payload: user }),
    });

    if (!res.ok) throw new Error('Create failed');
    const { user: created } = await res.json();

    return {
      id: created.id,
      name: user.name,
      email: user.email,
      role: 'admin',
      created_at: created.created_at,
      updated_at: created.updated_at ?? null,
      is_active: user.is_active ?? true,
    };
  },

  async updateUser(id: string, user: Partial<User>): Promise<User> {
      const { error } = await supabase.rpc('admin_update_user', {
        p_id: id,
        p_name: user.name ?? null,
        p_role: user.role ?? null,
        p_is_active: typeof user.is_active === 'boolean' ? user.is_active : null,
      });
      if (error) throw error;


    const users = await this.getUsers();
    return users.find(u => u.id === id)!;
  },

  async deleteUser(id: string): Promise<void> {
    // Deleting from profiles won’t delete from auth.users
    // Better: call your API route with service key
    const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
  },

  async resetUserPassword(email: string): Promise<void> {
    // Must go through your API route with service key
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'reset_password', payload: { email } }),
    });
    if (!res.ok) throw new Error('Reset failed');
  },
};

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { count: total } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    const { count: published } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    const { count: draft } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft');

    const { count: featured } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true);

    return {
      total_projects: total || 0,
      published_projects: published || 0,
      draft_projects: draft || 0,
      featured_projects: featured || 0,
      last_updated: new Date().toISOString()
    };
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    // This would require an activity log table
    // For now, return recent projects as activity
    const { data } = await supabase
      .from('projects')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(10);

    return (data || []).map(project => ({
      id: project.id,
      user_name: 'System',
      action: 'Updated project',
      project_title: project.title,
      timestamp: project.updated_at
    }));
  }
};

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color,
      is_active: cat.is_active,
      project_count: cat.project_count,
      created_at: cat.created_at,
      updated_at: cat.updated_at
    }));
  },

  async createCategory(category: CreateCategoryForm): Promise<Category> {
    const slug = category.name.toLowerCase().replace(/\s+/g, '-');
    
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        slug,
        description: category.description,
        color: category.color,
        is_active: category.is_active
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      color: data.color,
      is_active: true,
      project_count: 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const { error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        description: category.description,
        color: category.color,
        is_active: category.is_active
      })
      .eq('id', id);

    if (error) throw error;

    const categories = await this.getCategories();
    return categories.find(c => c.id === id)!;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};