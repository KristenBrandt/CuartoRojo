import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdminTeamMember } from '@/types';
import { useState } from 'react';
import { teamService } from '@/services/api';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  social_instagram: z.string().optional(),
  social_linkedin: z.string().optional(),
  social_behance: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TeamMemberFormProps {
  member?: AdminTeamMember;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TeamMemberForm({ member, onSuccess, onCancel }: TeamMemberFormProps) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(member?.avatar || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || '',
      role: member?.role || '',
      bio: member?.bio || '',
      social_instagram: member?.social_instagram || '',
      social_linkedin: member?.social_linkedin || '',
      social_behance: member?.social_behance || '',
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await teamService.uploadAvatar(file);
      setAvatarUrl(url);
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const memberData = {
        name: data.name,
        role: data.role,
        bio: data.bio,
        avatar: avatarUrl,
        social_instagram: data.social_instagram,
        social_linkedin: data.social_linkedin,
        social_behance: data.social_behance
      };

      if (member) {
        await teamService.updateTeamMember(member.id, memberData);
        toast.success('Team member updated successfully');
      } else {
        await teamService.createTeamMember(memberData);
        toast.success('Team member created successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error('Failed to save team member');
      console.error('Save error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar</Label>
        <div className="flex items-center gap-4">
          {avatarUrl && (
            <img 
              src={avatarUrl} 
              alt="Avatar preview" 
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Job Title *</Label>
        <Input
          id="role"
          {...register('role')}
          placeholder="Creative Director"
        />
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register('bio')}
          placeholder="Brief description of the team member..."
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Social Links</h3>
        
        <div className="space-y-2">
          <Label htmlFor="social_instagram">Instagram</Label>
          <Input
            id="social_instagram"
            {...register('social_instagram')}
            placeholder="https://instagram.com/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social_linkedin">LinkedIn</Label>
          <Input
            id="social_linkedin"
            {...register('social_linkedin')}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social_behance">Behance</Label>
          <Input
            id="social_behance"
            {...register('social_behance')}
            placeholder="https://behance.net/username"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting ? 'Saving...' : member ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}