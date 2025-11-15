import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  private profiles: Profile[] = [
    { id: '1', name: 'Administrador' },
    { id: '2', name: 'Usuário' },
    { id: '3', name: 'Moderador' },
  ];

  create(createProfileDto: CreateProfileDto): Profile {
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: createProfileDto.name,
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  findAll(): Profile[] {
    return this.profiles;
  }

  findOne(id: string): Profile {
    const profile = this.profiles.find((p) => p.id === id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  update(id: string, updateProfileDto: UpdateProfileDto): Profile {
    const profileIndex = this.profiles.findIndex((p) => p.id === id);
    if (profileIndex === -1) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    const updatedProfile = {
      ...this.profiles[profileIndex],
      ...updateProfileDto,
    };
    this.profiles[profileIndex] = updatedProfile;
    return updatedProfile;
  }

  remove(id: string): void {
    const profileIndex = this.profiles.findIndex((p) => p.id === id);
    if (profileIndex === -1) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    this.profiles.splice(profileIndex, 1);
  }
}
