import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { usersService } from '@/services/api';
import { User, CreateUserForm } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface UserFormProps {
  user?: User;                // if provided → edit mode
  onSave: (user: User) => void;
}

export function UserForm({ user, onSave }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserForm>({
    name: user?.name || '',
    email: user?.email || '',
    role: 'admin',
    is_active: user?.is_active ?? true,
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    if (!user && !formData.password) {
      toast({
        title: 'Error',
        description: 'La contraseña es requerida para nuevos usuarios',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      let savedUser: User;

      if (user) {
        // 🔹 Edit existing user
        savedUser = await usersService.updateUser(user.id, {
          name: formData.name,
          is_active: formData.is_active,
        });
      } else {
        // 🔹 Create new user (must include password)
        savedUser = await usersService.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          is_active: formData.is_active,

        });
      }

      onSave(savedUser);
      toast({
        title: user ? 'Usuario actualizado' : 'Usuario creado',
        description: user
          ? 'El usuario ha sido actualizado correctamente'
          : 'El usuario ha sido creado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: user
          ? 'No se pudo actualizar el usuario'
          : 'No se pudo crear el usuario',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nombre completo"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="usuario@ejemplo.com"
          required
          disabled={!!user} // cannot change after creation
        />
      </div>

      {/* Password (only show on create) */}
      {!user && (
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Contraseña"
            required
          />
        </div>
      )}


      {/* Active toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_active: checked })
          }
        />
        <Label htmlFor="is_active">Usuario activo</Label>
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
