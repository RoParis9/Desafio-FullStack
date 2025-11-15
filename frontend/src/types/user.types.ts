import { Profile } from './profile.types';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  profileId: string;
  profile?: Profile;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  profileId: string;
  isActive?: boolean;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileId?: string;
  isActive?: boolean;
}

