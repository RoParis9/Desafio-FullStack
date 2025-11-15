import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  // Mock do ProfilesService
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

    // Reset dos mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with isActive as true', () => {
      // Arrange (preparar)
      const createUserDto: CreateUserDto = {
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@example.com',
        profileId: '1',
      };

      // Mock do ProfilesService.findOne retornando um perfil válido
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      // Act (executar)
      const result = service.create(createUserDto);

      // Assert (verificar)
      expect(result).toBeDefined();
      expect(result.firstName).toBe('Ana');
      expect(result.lastName).toBe('Costa');
      expect(result.email).toBe('ana.costa@example.com');
      expect(result.isActive).toBe(true); // Sempre true na criação, mesmo que não seja passado no DTO
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

      // Mock do ProfilesService.findOne lançando NotFoundException
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
        lastName: 'Silva',
        email: 'joao.silva@example.com', // Email que já existe nos dados mockados
        profileId: '1',
      };

      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      expect(() => service.create(createUserDto)).toThrow(BadRequestException);
      expect(() => service.create(createUserDto)).toThrow(
        'User with email joao.silva@example.com already exists',
      );
    });

    // TODO: Implemente um teste para verificar se o usuário foi adicionado à lista
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

  describe('setActiveStatus', () => {
    it('should activate a user', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '3',
        name: 'Moderador',
      });

      // Usuário com id '3' está inativo nos dados mockados
      const result = service.setActiveStatus('3', true);

      expect(result.isActive).toBe(true);
    });

    it('should deactivate a user', () => {
      mockProfilesService.findOne.mockReturnValue({
        id: '1',
        name: 'Administrador',
      });

      // Usuário com id '1' está ativo nos dados mockados
      const result = service.setActiveStatus('1', false);

      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException when user does not exist', () => {
      expect(() => service.setActiveStatus('999', true)).toThrow(
        NotFoundException,
      );
    });
  });

  // TODO: Implemente testes para os métodos abaixo:
  // - findAll: deve retornar todos os usuários (sem os deletados)
  // - findAll: deve popular o profile em cada usuário
  // - findByProfile: deve retornar usuários filtrados por perfil
  // - findByProfile: deve lançar NotFoundException quando o perfil não existe
  // - update: deve atualizar um usuário existente
  // - update: deve validar se o profileId existe quando atualizado
  // - update: deve validar se o email é único quando atualizado
  // - update: deve lançar NotFoundException quando o usuário não existe
  // - remove: deve fazer soft delete (definir deletedAt)
  // - remove: deve lançar NotFoundException quando o usuário não existe
});
