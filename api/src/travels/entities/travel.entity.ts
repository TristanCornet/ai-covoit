import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Travel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  description: string;

  @Column('text')
  start_location: string;

  @Column('text')
  end_location: string;

  @Column('text')
  date: string;

  @Column('int')
  price: number;

  @Column('int')
  capacity: number;

  @Column('boolean')
  detour_allowed: boolean;

  @OneToMany(() => Booking, (booking) => booking.travel, {
    onDelete: 'CASCADE',
  })
  bookings: Booking[];

  @ManyToOne(() => User, (user) => user.travels, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
