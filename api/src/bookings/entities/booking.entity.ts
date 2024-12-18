import { Travel } from '../../travels/entities/travel.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  date: string;

  @Column('text')
  status: string;

  @Column('text')
  pickup_location: string;

  @Column('text')
  comment: string;

  @Column('int')
  nb_passengers: number;

  @ManyToOne(() => Travel, (travel) => travel.bookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  travel: Travel;
}
