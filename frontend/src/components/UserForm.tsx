'use client';
import { useState, useEffect } from 'react';
import { User, CreateUserDto, UpdateUserDto } from '@/types/user.types';
import { usersService } from '@/services/users.service';
import { profilesService } from '@/services/profiles.service';
import { Profile } from '@/types/profile.types';

interface UserFormProps {
  user?: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    profileId: user?.profileId || '',
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await profilesService.findAll();
        setProfiles(data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileId: user.profileId,
      });
    }
  }, [user]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email deve ser um endereço de email válido';
    }

    if (!formData.profileId?.trim()) {
      newErrors.profileId = 'Perfil é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (user) {
        const updatedUser = await usersService.update(user.id, formData);
        onSave(updatedUser);
      } else {
        const createData: CreateUserDto = {
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          email: formData.email || '',
          profileId: formData.profileId || '',
        };
        const newUser = await usersService.create(createData);
        onSave(newUser);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      const errorResponse = error as {
        response?: { data?: { message?: string | string[] } };
      };
      
      let errorMessage = 'Erro ao salvar usuário';
      
      if (errorResponse.response?.data?.message) {
        if (Array.isArray(errorResponse.response.data.message)) {
          errorMessage = errorResponse.response.data.message.join(', ');
        } else {
          errorMessage = errorResponse.response.data.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="mb-1 block text-sm font-medium text-zinc-400"
          >
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border bg-zinc-900 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 ${
              errors.firstName
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="mb-1 block text-sm font-medium text-zinc-400"
          >
            Sobrenome <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border bg-zinc-900 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 ${
              errors.lastName
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-zinc-400"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full rounded-lg border bg-zinc-900 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 ${
            errors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="profileId"
          className="mb-1 block text-sm font-medium text-zinc-400"
        >
          Perfil <span className="text-red-500">*</span>
        </label>
        <select
          id="profileId"
          name="profileId"
          value={formData.profileId}
          onChange={handleChange}
          required
          className={`w-full rounded-lg border bg-zinc-900 px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 ${
            errors.profileId
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600'
          }`}
        >
          <option value="">Selecione um perfil</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
        {errors.profileId && (
          <p className="mt-1 text-sm text-red-500">{errors.profileId}</p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : user ? 'Atualizar' : 'Criar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-700 px-4 py-2 font-medium text-zinc-100 transition-colors hover:bg-zinc-600 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

