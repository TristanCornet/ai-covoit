import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Travel } from '../../travels/entities/travel.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  firstname: string;

  @Column('text')
  lastname: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Travel, (travel) => travel.user, {
    onDelete: 'CASCADE',
  })
  travels: Travel[];
}
