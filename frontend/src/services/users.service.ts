import api from '../lib/api';
import { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

export const usersService = {
  async findAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async findOne(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async findByProfile(profileId: string): Promise<User[]> {
    const response = await api.get<User[]>(`/users/profile/${profileId}`);
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async activate(id: string): Promise<User> {
    const response = await api.put<User>(`/users/${id}/activate`);
    return response.data;
  },

  async deactivate(id: string): Promise<User> {
    const response = await api.put<User>(`/users/${id}/deactivate`);
    return response.data;
  },
};

