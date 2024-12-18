import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelsService } from '../travels/travels.service';
import { UsersService } from '../users/users.service';

describe('TravelsService', () => {
  let service: TravelsService;
  let usersService: UsersService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelsService,
        {
          provide: getRepositoryToken(Travel),
          useValue: mockRepository,
        },
        { provide: UsersService, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TravelsService>(TravelsService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
