import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      firstName: 'João',
      lastName: 'Costa',
      email: 'joao.costa@example.com',
      isActive: true,
      profileId: '1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@example.com',
      isActive: true,
      profileId: '2',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: '3',
      firstName: 'Pedro',
      lastName: 'Oliveira',
      email: 'pedro.oliveira@example.com',
      isActive: false,
      profileId: '3',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
    },
  ];

  constructor(private readonly profilesService: ProfilesService) {}

  create(createUserDto: CreateUserDto): User {
    try {
      this.profilesService.findOne(createUserDto.profileId);
    } catch {
      throw new BadRequestException(
        `Profile with ID ${createUserDto.profileId} not found`,
      );
    }

    const emailExists = this.users.some(
      (u) => u.email === createUserDto.email && !u.deletedAt,
    );
    if (emailExists) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const existingIds = this.users
      .filter((u) => !u.deletedAt)
      .map((u) => parseInt(u.id, 10))
      .filter((id) => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newId = (maxId + 1).toString();

    const newUser: User = {
      id: newId,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      isActive: createUserDto.isActive ?? true,
      profileId: createUserDto.profileId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return this.enrichWithProfile(newUser);
  }

  findAll(): User[] {
    return this.users
      .filter((u) => !u.deletedAt)
      .map((user) => this.enrichWithProfile(user));
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.enrichWithProfile(user);
  }

  findByProfile(profileId: string): User[] {
    try {
      this.profilesService.findOne(profileId);
    } catch {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }

    return this.users
      .filter((u) => u.profileId === profileId && !u.deletedAt)
      .map((user) => this.enrichWithProfile(user));
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((u) => u.id === id && !u.deletedAt);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.profileId) {
      try {
        this.profilesService.findOne(updateUserDto.profileId);
      } catch {
        throw new BadRequestException(
          `Profile with ID ${updateUserDto.profileId} not found`,
        );
      }
    }

    if (updateUserDto.email) {
      const emailExists = this.users.some(
        (u) => u.email === updateUserDto.email && u.id !== id && !u.deletedAt,
      );
      if (emailExists) {
        throw new BadRequestException(
          `User with email ${updateUserDto.email} already exists`,
        );
      }
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };
    this.users[userIndex] = updatedUser;
    return this.enrichWithProfile(updatedUser);
  }

  remove(id: string): void {
    const userIndex = this.users.findIndex((u) => u.id === id && !u.deletedAt);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users[userIndex].deletedAt = new Date();
  }

  setActiveStatus(id: string, isActive: boolean): User {
    const userIndex = this.users.findIndex((u) => u.id === id && !u.deletedAt);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users[userIndex].isActive = isActive;
    this.users[userIndex].updatedAt = new Date();
    return this.enrichWithProfile(this.users[userIndex]);
  }

  private enrichWithProfile(user: User): User {
    try {
      const profile = this.profilesService.findOne(user.profileId);
      return { ...user, profile };
    } catch {
      return user;
    }
  }
}
