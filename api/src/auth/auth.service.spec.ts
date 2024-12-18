import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw an error if email is invalid', async () => {
      const dto = {
        email: 'bob',
        password: 'Bob123456789!',
        firstname: 'Bob',
        lastname: 'Bob',
      };

      const promise = service.signUp(dto);

      const expected = new UnauthorizedException({ message: 'Email invalide' });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should trhow an error if email is already used', async () => {
      const dto = {
        email: 'bob@oclock.io',
        password: 'Bob123456789!',
        firstname: 'Bob',
        lastname: 'Bob',
      };

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce(dto);

      // Act
      const promise = service.signUp(dto);

      // Assert
      const expected = new UnauthorizedException({ message: 'Email existant' });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should trhow an error if too short password', async () => {
      const dto = {
        email: 'newemail@oclock.io',
        password: 'pwd',
        firstname: 'Bob',
        lastname: 'Bob',
      };

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      // Act
      const promise = service.signUp(dto);

      // Assert
      const expected = new UnauthorizedException({
        message: 'Mot de passe faible',
      });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should trhow an error if no uppercase in password', async () => {
      const dto = {
        email: 'newemail@oclock.io',
        password: 'pwd',
        firstname: 'Bob',
        lastname: 'Bob',
      };

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      // Act
      const promise = service.signUp(dto);

      // Assert
      const expected = new UnauthorizedException({
        message: 'Mot de passe faible',
      });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should trhow an error if no lowercase in password', async () => {
      const dto = {
        email: 'newemail@oclock.io',
        password: 'PASSWORDLONG',
        firstname: 'Bob',
        lastname: 'Bob',
      };

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      // Act
      const promise = service.signUp(dto);

      // Assert
      const expected = new UnauthorizedException({
        message: 'Mot de passe faible',
      });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should trhow an error if no digit in password', async () => {
      const dto = {
        email: 'newemail@oclock.io',
        password: 'MotDePasseLong',
        firstname: 'Bob',
        lastname: 'Bob',
      };

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      // Act
      const promise = service.signUp(dto);

      // Assert
      const expected = new UnauthorizedException({
        message: 'Mot de passe faible',
      });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should trhow an error if no special char in password', async () => {
      const dto = {
        email: 'newemail@oclock.io',
        password: 'M0tDePasseL0ng',
        firstname: 'Bob',
        lastname: 'Bob',
      };

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      // Act
      const promise = service.signUp(dto);

      // Assert
      const expected = new UnauthorizedException({
        message: 'Mot de passe faible',
      });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should success', async () => {
      const dto = {
        email: 'newemail@oclock.io',
        password: 'M0tD*Pass*L0ng',
        firstname: 'Bob',
        lastname: 'Bob',
      };

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      mockUsersService.create.mockResolvedValueOnce(dto);

      // Act
      const promise = service.signUp(dto);

      // Assert
      await expect(promise).resolves.toEqual(dto);
    });
  });

  describe('signIn', () => {
    it('should trhow an error if email is unknown', async () => {
      const email = 'newemail@oclock.io';
      const password = 'test';

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      // Act
      const promise = service.signIn(email, password);

      // Assert
      const expected = new UnauthorizedException({
        message: 'Email inexistant',
      });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should throw an error if password is incorrect', async () => {
      const email = 'newemail@oclock.io';
      const password = 'test';

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce({
        email,
        password: 'Mot de passe non hashé',
      });

      // Act
      const promise = service.signIn(email, password);

      // Assert
      const expected = new UnauthorizedException({
        message: 'Mot de passe incorrect',
      });
      await expect(promise).rejects.toThrow(expected);
    });

    it('should success and return an access token', async () => {
      const email = 'newemail@oclock.io';
      const password = 'test';
      const hashedPassword =
        '$2b$10$Z8iEoVVkWZa4mVxds4.Ti.ZquuOetvT8.dwA.VL.TqTiyLi1yRCou';

      // Arrange
      mockUsersService.findByEmail.mockResolvedValueOnce({
        email,
        password: hashedPassword,
      });
      mockJwtService.signAsync.mockResolvedValueOnce('token');

      // Act
      const promise = service.signIn(email, password);

      // Assert
      await expect(promise).resolves.toEqual({
        access_token: 'token',
      });
    });
  });
});
