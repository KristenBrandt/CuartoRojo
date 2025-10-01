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
import { supabase } from '@/integrations/supabase/client';

// ----- Keep your interface exactly the same -----
interface SiteSettings {
  contactEmail: string;
  phone: string;
  address: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

// Map UI fields -> DB keys used in your table
const K = {
  contactEmail: 'contact_email',
  phone: 'contact_phone',
  address: 'address',
  social: {
    instagram: 'social_instagram',
    facebook: 'social_facebook',
    twitter: 'social_twitter',
    linkedin: 'social_linkedin',
  },
} as const;

export default function Settings() {
  // Keep your initial local defaults
  const [settings, setSettings] = useState<SiteSettings>({
    contactEmail: 'contacto@cuartorojo.com',
    phone: '+1 234 567 890',
    address: 'Calle Principal 123, Ciudad',
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
    }
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { toast } = useToast();

  // -------- Load from Supabase on mount --------
  useEffect(() => {
    (async () => {
      try {
        const keys = [
          K.contactEmail,
          K.phone,
          K.address,
          K.social.instagram,
          K.social.facebook,
          K.social.twitter,
          K.social.linkedin,
        ];

        const { data, error } = await supabase
          .from('settings')
          .select('key, value')
          .in('key', keys);

        if (error) throw error;

        const map = new Map<string, string>();
        (data ?? []).forEach((r: any) => map.set(r.key, r.value ?? ''));

        setSettings(prev => ({
          ...prev,
          contactEmail: map.get(K.contactEmail) ?? prev.contactEmail,
          phone: map.get(K.phone) ?? prev.phone,
          address: map.get(K.address) ?? prev.address,
          socialMedia: {
            instagram: map.get(K.social.instagram) ?? prev.socialMedia.instagram,
            facebook: map.get(K.social.facebook) ?? prev.socialMedia.facebook,
            twitter: map.get(K.social.twitter) ?? prev.socialMedia.twitter,
            linkedin: map.get(K.social.linkedin) ?? prev.socialMedia.linkedin,
          },
        }));
      } catch (err: any) {
        toast({
          title: 'Error cargando ajustes',
          description: err.message ?? 'No se pudieron cargar los ajustes',
          variant: 'destructive',
        });
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  // -------- Save to Supabase (batch upsert) --------
  const handleSave = async () => {
    try {
      setLoading(true);

      const now = new Date().toISOString();
      const rows = [
        { key: K.contactEmail, value: settings.contactEmail, updated_at: now },
        { key: K.phone,        value: settings.phone,        updated_at: now },
        { key: K.address,      value: settings.address,      updated_at: now },
        { key: K.social.instagram, value: settings.socialMedia.instagram, updated_at: now },
        { key: K.social.facebook,  value: settings.socialMedia.facebook,  updated_at: now },
        { key: K.social.twitter,   value: settings.socialMedia.twitter,   updated_at: now },
        { key: K.social.linkedin,  value: settings.socialMedia.linkedin,  updated_at: now },
      ];

      const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
      if (error) throw error;

      toast({
        title: 'Configuración guardada',
        description: 'Los cambios han sido guardados correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message ?? 'No se pudieron guardar los cambios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // -------- Keep your dot-path updater as-is --------
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

  if (initializing) {
    return (
      <AdminLayout>
        <div className="p-8 text-muted-foreground">Cargando ajustes…</div>
      </AdminLayout>
    );
  }

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

        <Tabs defaultValue="contact" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contact">Contacto</TabsTrigger>
            <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          </TabsList>

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
                    placeholder="+502 0000 0000"
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
        </Tabs>
      </div>
    </AdminLayout>
  );
}