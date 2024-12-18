import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { TravelsService } from '../travels/travels.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let travelsService: TravelsService;

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
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        { provide: TravelsService, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    travelsService = module.get<TravelsService>(TravelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
