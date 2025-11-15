import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockProfilesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: ProfilesService,
          useValue: mockProfilesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with isActive as true', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@example.com',
        profileId: '1',
      };

      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      const result = service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.firstName).toBe('Ana');
      expect(result.lastName).toBe('Costa');
      expect(result.email).toBe('ana.costa@example.com');
      expect(result.isActive).toBe(true);
      expect(result.profileId).toBe('1');
      expect(mockProfilesService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw BadRequestException when profile does not exist', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@example.com',
        profileId: '999',
      };

      mockProfilesService.findOne.mockImplementation(() => {
        throw new NotFoundException('Profile with ID 999 not found');
      });

      expect(() => service.create(createUserDto)).toThrow(BadRequestException);
      expect(() => service.create(createUserDto)).toThrow(
        'Profile with ID 999 not found',
      );
    });

    it('should throw BadRequestException when email already exists', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'João',
        lastName: 'Costa',
        email: 'joao.costa@example.com',
        profileId: '1',
      };

      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      expect(() => service.create(createUserDto)).toThrow(BadRequestException);
      expect(() => service.create(createUserDto)).toThrow(
        'User with email joao.costa@example.com already exists',
      );
    });
  });

  describe('findOne', () => {
    it('should return a user when found', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      const result = service.findOne('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.firstName).toBe('João');
      expect(result.profile).toBeDefined();
      expect(result.profile?.name).toBe('Administrador');
    });

    it('should throw NotFoundException when user does not exist', () => {
      expect(() => service.findOne('999')).toThrow(NotFoundException);
      expect(() => service.findOne('999')).toThrow(
        'User with ID 999 not found',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users without deleted ones', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      const result = service.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((user) => !user.deletedAt)).toBe(true);
    });

    it('should populate profile in each user', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      const result = service.findAll();

      expect(result.length).toBeGreaterThan(0);
      result.forEach((user) => {
        expect(user.profile).toBeDefined();
      });
    });
  });

  describe('findByProfile', () => {
    it('should return users filtered by profile', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      const result = service.findByProfile('1');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      result.forEach((user) => {
        expect(user.profileId).toBe('1');
        expect(user.deletedAt).toBeUndefined();
      });
    });

    it('should throw NotFoundException when profile does not exist', () => {
      mockProfilesService.findOne.mockImplementation(() => {
        throw new NotFoundException('Profile with ID 999 not found');
      });

      expect(() => service.findByProfile('999')).toThrow(NotFoundException);
      expect(() => service.findByProfile('999')).toThrow(
        'Profile with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a user successfully', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      const updateDto = {
        firstName: 'João Atualizado',
      };

      const result = service.update('1', updateDto);

      expect(result).toBeDefined();
      expect(result.firstName).toBe('João Atualizado');
      expect(result.id).toBe('1');
    });

    it('should validate profileId when updating', () => {
      mockProfilesService.findOne.mockImplementation(() => {
        throw new NotFoundException('Profile with ID 999 not found');
      });

      const updateDto = {
        profileId: '999',
      };

      expect(() => service.update('1', updateDto)).toThrow(BadRequestException);
      expect(() => service.update('1', updateDto)).toThrow(
        'Profile with ID 999 not found',
      );
    });

    it('should validate email uniqueness when updating', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      const updateDto = {
        email: 'maria.santos@example.com',
      };

      expect(() => service.update('1', updateDto)).toThrow(BadRequestException);
      expect(() => service.update('1', updateDto)).toThrow(
        'User with email maria.santos@example.com already exists',
      );
    });

    it('should throw NotFoundException when user does not exist', () => {
      expect(() => service.update('999', { firstName: 'Test' })).toThrow(
        NotFoundException,
      );
      expect(() => service.update('999', { firstName: 'Test' })).toThrow(
        'User with ID 999 not found',
      );
    });
  });

  describe('remove', () => {
    it('should perform soft delete on user', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      service.remove('1');

      const allUsers = service.findAll();
      const deletedUser = allUsers.find((u) => u.id === '1');
      expect(deletedUser).toBeUndefined();
    });

    it('should throw NotFoundException when user does not exist', () => {
      expect(() => service.remove('999')).toThrow(NotFoundException);
      expect(() => service.remove('999')).toThrow('User with ID 999 not found');
    });
  });

  describe('setActiveStatus', () => {
    it('should activate a user', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '3',
        name: 'Moderador',
      });

      const result = service.setActiveStatus('3', true);

      expect(result.isActive).toBe(true);
    });

    it('should deactivate a user', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      const result = service.setActiveStatus('1', false);

      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException when user does not exist', () => {
      expect(() => service.setActiveStatus('999', true)).toThrow(
        NotFoundException,
      );
    });
  });
});
