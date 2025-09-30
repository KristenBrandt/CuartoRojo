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
  user?: User;
  onSave: (user: User) => void;
}

export function UserForm({ user, onSave }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserForm>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'admin',
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
        // Update existing user
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        savedUser = await usersService.updateUser(user.id, updateData);
      } else {
        // Create new user
        savedUser = await usersService.createUser(formData);
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

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="usuario@ejemplo.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {user ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder={user ? 'Dejar en blanco para mantener actual' : 'Contraseña'}
          required={!user}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rol</Label>
        <Select
          value={formData.role}
          onValueChange={(value: 'admin') => 
            setFormData({ ...formData, role: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : (user ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  );
}