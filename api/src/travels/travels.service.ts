import { Injectable } from '@nestjs/common';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Travel } from './entities/travel.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private travelRepository: Repository<Travel>,
    private usersService: UsersService,
  ) {}

  async create(createTravelDto: CreateTravelDto) {
    const user = await this.usersService.findOne(
      createTravelDto.userId.toString(),
    );
    if (!user) {
      throw new Error('User not found');
    }
    const travel = this.travelRepository.create({
      ...createTravelDto,
      user,
    });
    return await this.travelRepository.save(travel);
  }

  async findAll() {
    return await this.travelRepository.find();
  }

  async findAllWithBookings() {
    return await this.travelRepository.find({ relations: ['bookings'] });
  }

  async findOne(id: string) {
    return await this.travelRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTravelDto: UpdateTravelDto) {
    const toUpdate = await this.travelRepository.findOne({ where: { id } });
    const updated = Object.assign(toUpdate, updateTravelDto);
    return await this.travelRepository.save(updated);
  }

  async remove(id: string) {
    return await this.travelRepository.delete(id);
  }
}
