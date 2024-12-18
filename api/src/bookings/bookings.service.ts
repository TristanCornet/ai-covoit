import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { TravelsService } from '../travels/travels.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private travelsService: TravelsService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const travel = await this.travelsService.findOne(
      createBookingDto.travelId.toString(),
    );
    if (!travel) {
      throw new Error('Travel not found');
    }
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      travel,
    });
    return await this.bookingRepository.save(booking);
  }

  async findAll() {
    return await this.bookingRepository.find();
  }

  async findOne(id: string) {
    return await this.bookingRepository.findOne({ where: { id } });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const toUpdate = await this.bookingRepository.findOne({ where: { id } });
    const updated = Object.assign(toUpdate, updateBookingDto);
    return await this.bookingRepository.save(updated);
  }

  async remove(id: string) {
    return await this.bookingRepository.delete(id);
  }
}
