import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { projectsService, categoriesService } from '@/services/api';
import { AdminProject, Category } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, X, Video, ArrowLeft, Star } from 'lucide-react';

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [project, setProject] = useState<Partial<AdminProject>>({
    title: '',
    short_description: '',
    full_description: '',
    // your service currently returns category NAME only.
    category: undefined,
    category_id: undefined,
    gallery: [],
    client_name: '',
    event_date: '',
    location: '',
    status: 'draft',
    is_featured: false,
    seo_title: '',
    seo_description: '',
    tags: [],
    cover_image_url: null,
  });

  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const { toast } = useToast();

  const [cats, setCats] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  useEffect(() => {
    if (isEdit && id) loadProject(id);
  }, [isEdit, id]);

  useEffect(() => {
    (async () => {
      try {
        setCatsLoading(true);
        // Use your existing service and filter active here
        const all = await categoriesService.getCategories();
        const active = all.filter(c => c.is_active);
        setCats(active);

        // If editing and we only have the category name, try to find its id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const category_id = project.category_id ?? undefined;
        if (isEdit && project.category && !category_id) {
          const match = active.find(c => c.name === project.category);
          if (match) {
            setProject(prev => ({ ...prev, category_id: match.id } as any));
          }
        }
      } catch (e) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las categorías',
          variant: 'destructive',
        });
      } finally {
        setCatsLoading(false);
      }
    })();
    // we intentionally don't include `project` in deps to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true);
      const data = await projectsService.getProject(projectId);
      setProject(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el proyecto',
        variant: 'destructive',
      });
      navigate('/admin/proyectos');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const catId = project.category_id ?? undefined;
    if (!project.title || !catId) {
      toast({
        title: 'Error',
        description: 'Por favor complete los campos requeridos (*)',
        variant: 'destructive',
      });
      return false;
    }
    if ((project.seo_title || '').length > 60) {
      toast({
        title: 'SEO',
        description: 'El título meta debe tener máximo 60 caracteres',
        variant: 'destructive',
      });
      return false;
    }
    if ((project.seo_description || '').length > 160) {
      toast({
        title: 'SEO',
        description: 'La descripción meta debe tener máximo 160 caracteres',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload: Partial<AdminProject> = { ...project };

      // Optional: auto-slug on create if not set
      if (!isEdit && project.title && !(payload as any).slug) {
        (payload as any).slug = slugify(project.title);
      }

      if (isEdit && id) {
        await projectsService.updateProject(id, payload);
        toast({ title: 'Proyecto actualizado', description: 'El proyecto ha sido actualizado correctamente' });
      } else {
        await projectsService.createProject(payload);
        toast({ title: 'Proyecto creado', description: 'El proyecto ha sido creado correctamente' });
      }

      navigate('/admin/proyectos');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el proyecto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const t = currentTag.trim();
    if (t && !project.tags?.includes(t)) {
      setProject(prev => ({
        ...prev,
        tags: [...(prev.tags || []), t]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProject(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files) return;

    try {
      const uploaded = await Promise.all(Array.from(files).map(file => projectsService.uploadMedia(file)));
      setProject(prev => ({
        ...prev,
        gallery: [
          ...(prev.gallery || []),
          ...uploaded.map((m, i) => ({
            id: (Date.now() + i).toString(),
            project_id: prev.id || '',
            url: m.url,
            type: files[i].type.startsWith('video/') ? 'video' as const : 'image' as const,
            alt_text: '',
            order_index: (prev.gallery?.length || 0) + i
          })),
        ],
      }));
      toast({ title: 'Archivos subidos', description: `${uploaded.length} archivo(s) subido(s) correctamente` });
    } catch {
      toast({ title: 'Error', description: 'No se pudieron subir los archivos', variant: 'destructive' });
    }
  };

  const removeMedia = (mediaId: string) => {
    setProject(prev => ({
      ...prev,
      gallery: prev.gallery?.filter(item => item.id !== mediaId) || []
    }));
  };

  // cover + alt + reorder
  const markAsCover = (url: string) => setProject(prev => ({ ...prev, cover_image_url: url }));
  const updateAlt = (mediaId: string, alt: string) => {
    setProject(prev => ({
      ...prev,
      gallery: prev.gallery?.map(i => (i.id === mediaId ? { ...i, alt_text: alt } : i)) || [],
    }));
  };
  const moveMedia = (mediaId: string, dir: 'left' | 'right') => {
    setProject(prev => {
      const g = [...(prev.gallery || [])];
      const idx = g.findIndex(i => i.id === mediaId);
      if (idx < 0) return prev;
      const swap = dir === 'left' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= g.length) return prev;
      [g[idx], g[swap]] = [g[swap], g[idx]];
      return { ...prev, gallery: g.map((it, i) => ({ ...it, order_index: i })) };
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/admin/proyectos')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">{isEdit ? 'Editar Proyecto' : 'Crear Proyecto'}</h1>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Medios</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Datos básicos del proyecto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={project.title || ''}
                      onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título del proyecto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={project.category_id ?? undefined}
                      onValueChange={(value) => {
                        const picked = cats.find(c => c.id === value);
                        setProject(prev => ({
                          ...prev,
                          category_id: value,
                          category: picked?.name || prev.category,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={catsLoading ? 'Cargando…' : 'Seleccionar categoría'} />
                      </SelectTrigger>
                      <SelectContent>
                        {catsLoading ? (
                          <SelectItem value="__loading" disabled>Cargando…</SelectItem>
                        ) : cats.length ? (
                          cats.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="__empty" disabled>No hay categorías activas</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Descripción Corta</Label>
                  <Textarea
                    id="short_description"
                    value={project.short_description || ''}
                    onChange={(e) => setProject(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Descripción corta del proyecto"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_description">Descripción Completa</Label>
                  <Textarea
                    id="full_description"
                    value={project.full_description || ''}
                    onChange={(e) => setProject(prev => ({ ...prev, full_description: e.target.value }))}
                    placeholder="Descripción completa del proyecto"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_name">Cliente</Label>
                    <Input
                      id="client_name"
                      value={project.client_name || ''}
                      onChange={(e) => setProject(prev => ({ ...prev, client_name: e.target.value }))}
                      placeholder="Nombre del cliente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event_date">Fecha</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={project.event_date ?? ''}
                      onChange={(e) => setProject(prev => ({ ...prev, event_date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={project.location || ''}
                      onChange={(e) => setProject(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ubicación del proyecto"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Agregar tag"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Agregar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Medios del Proyecto</CardTitle>
                <CardDescription>Imágenes y videos del proyecto (elige una portada)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-dashed border-2 border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => handleMediaUpload(e.target.files)}
                      className="hidden"
                      id="media-upload"
                    />
                    {/* clickable now */}
                    <label htmlFor="media-upload" className="cursor-pointer inline-block">
                      <Button variant="outline" size="sm">
                        Seleccionar Archivos
                      </Button>
                    </label>
                  </div>
                </div>

                {!!project.gallery?.length && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.gallery.map((item, idx) => {
                      const isCover = project.cover_image_url === item.url;
                      return (
                        <div key={item.id} className="relative group rounded-lg border p-3">
                          <div className="flex gap-3">
                            <div className="w-32 aspect-square bg-muted rounded-lg overflow-hidden shrink-0">
                              {item.type === 'image' ? (
                                <img
                                  src={item.url}
                                  alt={item.alt_text || 'Imagen del proyecto'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Video className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant={isCover ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => markAsCover(item.url)}
                                >
                                  <Star className="h-4 w-4 mr-1" />
                                  {isCover ? 'Portada' : 'Marcar portada'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => moveMedia(item.id, 'left')}
                                  disabled={idx === 0}
                                  aria-label="Mover a la izquierda"
                                >
                                  ←
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => moveMedia(item.id, 'right')}
                                  disabled={idx === (project.gallery!.length - 1)}
                                  aria-label="Mover a la derecha"
                                >
                                  →
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeMedia(item.id)}
                                  aria-label="Eliminar"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`alt-${item.id}`}>Texto alternativo</Label>
                                <Input
                                  id={`alt-${item.id}`}
                                  value={item.alt_text || ''}
                                  onChange={(e) => updateAlt(item.id, e.target.value)}
                                  placeholder="Describe brevemente la imagen"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Optimización SEO</CardTitle>
                <CardDescription>Configurar metadatos para motores de búsqueda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">Título Meta (≤60)</Label>
                  <Input
                    id="seo_title"
                    value={project.seo_title || ''}
                    onChange={(e) => setProject(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="Título para SEO"
                  />
                  <p className="text-xs text-muted-foreground">{(project.seo_title || '').length}/60</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description">Descripción Meta (≤160)</Label>
                  <Textarea
                    id="seo_description"
                    value={project.seo_description || ''}
                    onChange={(e) => setProject(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="Descripción para SEO"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{(project.seo_description || '').length}/160</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Proyecto</CardTitle>
                <CardDescription>Estado y visibilidad del proyecto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="status">Estado</Label>
                    <p className="text-sm text-muted-foreground">Estado de publicación del proyecto</p>
                  </div>
                  <Select
                    value={project.status}
                    onValueChange={(value: AdminProject['status']) => setProject(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_featured">Destacado</Label>
                    <p className="text-sm text-muted-foreground">Aparecerá en la sección de proyectos destacados</p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={!!project.is_featured}
                    onCheckedChange={(checked) => setProject(prev => ({ ...prev, is_featured: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
