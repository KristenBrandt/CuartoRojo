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
import { projectsService } from '@/services/api';
import { AdminProject } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, X, Image, Video, ArrowLeft } from 'lucide-react';

const categories = [
  'Logística',
  'Cobertura', 
  'Food Styling',
  'Otro'
];

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [project, setProject] = useState<Partial<AdminProject>>({
    title: '',
    short_description: '',
    full_description: '',
    category: undefined,
    gallery: [],
    client_name: '',
    event_date: '',
    location: '',
    status: 'draft',
    is_featured: false,
    seo_title: '',
    seo_description: '',
    tags: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isEdit && id) {
      loadProject(id);
    }
  }, [isEdit, id]);

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

  const handleSave = async () => {
    if (!project.title || !project.category) {
      toast({
        title: 'Error',
        description: 'Por favor complete los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit && id) {
        await projectsService.updateProject(id, project);
        toast({
          title: 'Proyecto actualizado',
          description: 'El proyecto ha sido actualizado correctamente',
        });
      } else {
        await projectsService.createProject(project);
        toast({
          title: 'Proyecto creado',
          description: 'El proyecto ha sido creado correctamente',
        });
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
    if (currentTag.trim() && !project.tags?.includes(currentTag.trim())) {
      setProject(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
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
      const uploadPromises = Array.from(files).map(file => 
        projectsService.uploadMedia(file)
      );
      
      const uploadedMedia = await Promise.all(uploadPromises);
      
      setProject(prev => ({
        ...prev,
        gallery: [
          ...(prev.gallery || []),
          ...uploadedMedia.map((media, index) => ({
            id: (Date.now() + index).toString(),
            project_id: prev.id || '',
            url: media.url,
            type: files[index].type.startsWith('video/') ? 'video' as const : 'image' as const,
            alt_text: '',
            order_index: (prev.gallery?.length || 0) + index
          }))
        ]
      }));
      
      toast({
        title: 'Archivos subidos',
        description: `${uploadedMedia.length} archivo(s) subido(s) correctamente`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron subir los archivos',
        variant: 'destructive',
      });
    }
  };

  const removeMedia = (mediaId: string) => {
    setProject(prev => ({
      ...prev,
      gallery: prev.gallery?.filter(item => item.id !== mediaId) || []
    }));
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
            <h1 className="text-3xl font-bold">
              {isEdit ? 'Editar Proyecto' : 'Crear Proyecto'}
            </h1>
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
                <CardDescription>
                  Datos básicos del proyecto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={project.title}
                      onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título del proyecto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={project.category}
                      onValueChange={(value: AdminProject['category']) => setProject(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Descripción Corta</Label>
                  <Textarea
                    id="short_description"
                    value={project.short_description}
                    onChange={(e) => setProject(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Descripción corta del proyecto"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_description">Descripción Completa</Label>
                  <Textarea
                    id="full_description"
                    value={project.full_description}
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
                      value={project.client_name}
                      onChange={(e) => setProject(prev => ({ ...prev, client_name: e.target.value }))}
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Fecha</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={project.event_date || ''}
                      onChange={(e) => setProject(prev => ({ ...prev, event_date: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={project.location}
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
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
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
                <CardDescription>
                  Imágenes y videos del proyecto
                </CardDescription>
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
                    <label htmlFor="media-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="pointer-events-none">
                        Seleccionar Archivos
                      </Button>
                    </label>
                  </div>
                </div>

                {project.gallery && project.gallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery.map((item) => (
                      <div key={item.id} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
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
                        <button
                          onClick={() => removeMedia(item.id)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Optimización SEO</CardTitle>
                <CardDescription>
                  Configurar metadatos para motores de búsqueda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">Título Meta</Label>
                  <Input
                    id="seo_title"
                    value={project.seo_title || ''}
                    onChange={(e) => setProject(prev => ({
                      ...prev,
                      seo_title: e.target.value
                    }))}
                    placeholder="Título para SEO (máx. 60 caracteres)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seo_description">Descripción Meta</Label>
                  <Textarea
                    id="seo_description"
                    value={project.seo_description || ''}
                    onChange={(e) => setProject(prev => ({
                      ...prev,
                      seo_description: e.target.value
                    }))}
                    placeholder="Descripción para SEO (máx. 160 caracteres)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Proyecto</CardTitle>
                <CardDescription>
                  Estado y visibilidad del proyecto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="status">Estado</Label>
                    <p className="text-sm text-muted-foreground">
                      Estado de publicación del proyecto
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      Aparecerá en la sección de proyectos destacados
                    </p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={project.is_featured}
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