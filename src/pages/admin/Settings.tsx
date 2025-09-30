import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Image, Mail, Globe, Shield } from 'lucide-react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  features: {
    enableComments: boolean;
    enableNewsletter: boolean;
    enableAnalytics: boolean;
    maintenanceMode: boolean;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Cuarto Rojo',
    siteDescription: 'Estudio de fotografía y video profesional',
    contactEmail: 'contacto@cuartorojo.com',
    phone: '+1 234 567 890',
    address: 'Calle Principal 123, Ciudad',
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
    },
    seo: {
      metaTitle: 'Cuarto Rojo - Fotografía y Video Profesional',
      metaDescription: 'Estudio profesional de fotografía y video especializado en eventos, retratos corporativos y producción audiovisual.',
      keywords: 'fotografía, video, estudio, profesional, eventos',
    },
    features: {
      enableComments: true,
      enableNewsletter: false,
      enableAnalytics: true,
      maintenanceMode: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual save logic with database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Configuración guardada',
        description: 'Los cambios han sido guardados correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const result = { ...prev };
      let current: any = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return result;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ajustes</h1>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
            <TabsTrigger value="social">Redes Sociales</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Información General
                </CardTitle>
                <CardDescription>
                  Configuración básica del sitio web
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del Sitio</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSettings('siteName', e.target.value)}
                    placeholder="Nombre de tu estudio"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descripción</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSettings('siteDescription', e.target.value)}
                    placeholder="Descripción de tu estudio"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Logo y Branding</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Logo
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Recomendado: 200x200px, formato PNG con fondo transparente
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Información de Contacto
                </CardTitle>
                <CardDescription>
                  Datos de contacto que aparecerán en el sitio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contacto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSettings('contactEmail', e.target.value)}
                    placeholder="contacto@tudominio.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => updateSettings('phone', e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => updateSettings('address', e.target.value)}
                    placeholder="Tu dirección completa"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
                <CardDescription>
                  Enlaces a tus perfiles en redes sociales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => updateSettings('socialMedia.instagram', e.target.value)}
                    placeholder="https://instagram.com/tu_usuario"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => updateSettings('socialMedia.facebook', e.target.value)}
                    placeholder="https://facebook.com/tu_pagina"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    value={settings.socialMedia.twitter}
                    onChange={(e) => updateSettings('socialMedia.twitter', e.target.value)}
                    placeholder="https://twitter.com/tu_usuario"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => updateSettings('socialMedia.linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/tu_perfil"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Optimización SEO</CardTitle>
                <CardDescription>
                  Configuración para motores de búsqueda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Título Meta</Label>
                  <Input
                    id="metaTitle"
                    value={settings.seo.metaTitle}
                    onChange={(e) => updateSettings('seo.metaTitle', e.target.value)}
                    placeholder="Título que aparece en Google"
                  />
                  <p className="text-sm text-muted-foreground">
                    Máximo 60 caracteres recomendados
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Descripción Meta</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.seo.metaDescription}
                    onChange={(e) => updateSettings('seo.metaDescription', e.target.value)}
                    placeholder="Descripción que aparece en Google"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Máximo 160 caracteres recomendados
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="keywords">Palabras Clave</Label>
                  <Input
                    id="keywords"
                    value={settings.seo.keywords}
                    onChange={(e) => updateSettings('seo.keywords', e.target.value)}
                    placeholder="palabra1, palabra2, palabra3"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separadas por comas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </AdminLayout>
  );
}