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

    // TODO: Implemente um teste para verificar se o perfil foi adicionado à lista
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

  // TODO: Implemente testes para os métodos abaixo:
  // - findAll: deve retornar todos os perfis
  // - update: deve atualizar um perfil existente
  // - update: deve lançar NotFoundException quando o perfil não existe
  // - remove: deve remover um perfil existente
  // - remove: deve lançar NotFoundException quando o perfil não existe
});
