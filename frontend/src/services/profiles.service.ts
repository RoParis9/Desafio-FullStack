import api from '../lib/api';
import { Profile } from '../types/profile.types';

export const profilesService = {
  async findAll(): Promise<Profile[]> {
    const response = await api.get<Profile[]>('/profiles');
    return response.data;
  },

  async findOne(id: string): Promise<Profile> {
    const response = await api.get<Profile>(`/profiles/${id}`);
    return response.data;
  },

  async create(data: { name: string }): Promise<Profile> {
    const response = await api.post<Profile>('/profiles', data);
    return response.data;
  },

  async update(id: string, data: { name?: string }): Promise<Profile> {
    const response = await api.patch<Profile>(`/profiles/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/profiles/${id}`);
  },
};

