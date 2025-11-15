import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilesService],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new profile', () => {
      const createProfileDto: CreateProfileDto = {
        name: 'Novo Perfil',
      };

      const result = service.create(createProfileDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('Novo Perfil');
      expect(result.id).toBeDefined();
    });

    it('should add profile to the list', () => {
      const initialCount = service.findAll().length;
      const createProfileDto: CreateProfileDto = {
        name: 'Perfil Teste',
      };

      service.create(createProfileDto);

      const finalCount = service.findAll().length;
      expect(finalCount).toBe(initialCount + 1);
    });
  });

  describe('findAll', () => {
    it('should return all profiles', () => {
      const result = service.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a profile when found', () => {
      const result = service.findOne('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.name).toBe('Administrador');
    });

    it('should throw NotFoundException when profile does not exist', () => {
      expect(() => service.findOne('999')).toThrow(NotFoundException);
      expect(() => service.findOne('999')).toThrow(
        'Profile with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a profile successfully', () => {
      const updateDto = {
        name: 'Administrador Atualizado',
      };

      const result = service.update('1', updateDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('Administrador Atualizado');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException when profile does not exist', () => {
      const updateDto = {
        name: 'Test',
      };

      expect(() => service.update('999', updateDto)).toThrow(NotFoundException);
      expect(() => service.update('999', updateDto)).toThrow(
        'Profile with ID 999 not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove a profile successfully', () => {
      const initialCount = service.findAll().length;

      service.remove('1');

      const finalCount = service.findAll().length;
      expect(finalCount).toBe(initialCount - 1);
      expect(() => service.findOne('1')).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when profile does not exist', () => {
      expect(() => service.remove('999')).toThrow(NotFoundException);
      expect(() => service.remove('999')).toThrow(
        'Profile with ID 999 not found',
      );
    });
  });
});
