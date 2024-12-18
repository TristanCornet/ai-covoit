import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm/dist';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(User), useValue: mockRepository },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = new User();
    mockRepository.save.mockResolvedValue(user);
    expect(await service.create(user)).toEqual(user);
    expect(mockRepository.save).toHaveBeenCalledWith(user);
  });

  it('should find all users', async () => {
    const users = [new User(), new User()];
    mockRepository.find.mockResolvedValue(users);
    expect(await service.findAll()).toEqual(users);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should find a user by id', async () => {
    const user = new User();
    user.id = '1';
    mockRepository.findOne.mockResolvedValue(user);
    expect(await service.findOne('1')).toEqual(user);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should find a user by email', async () => {
    const user = new User();
    user.email = 'test@example.com';
    mockRepository.findOne.mockResolvedValue(user);
    expect(await service.findByEmail('test@example.com')).toEqual(user);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should update a user', async () => {
    const user = new User();
    user.id = '1';
    const updatedUser = { ...user, firstname: 'Updated Name' };
    mockRepository.findOne.mockResolvedValue(user);
    mockRepository.save.mockResolvedValue(updatedUser);
    expect(await service.update('1', { firstname: 'Updated Name' })).toEqual(
      updatedUser,
    );
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
  });

  it('should update a user by email', async () => {
    const user = new User();
    user.email = 'test@example.com';
    const updatedUser = { ...user, firstname: 'Updated Name' };
    mockRepository.findOne.mockResolvedValue(user);
    mockRepository.save.mockResolvedValue(updatedUser);
    expect(
      await service.updateByEmail('test@example.com', {
        firstname: 'Updated Name',
      }),
    ).toEqual(updatedUser);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
  });

  it('should delete a user', async () => {
    const user = new User();
    user.id = '1';
    mockRepository.delete.mockResolvedValue(user);
    expect(await service.remove('1')).toEqual(user);
    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });
});
