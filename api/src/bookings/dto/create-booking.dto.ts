import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  public date: string;
  @ApiProperty()
  public status: string;
  @ApiProperty()
  public pickup_location: string;
  @ApiProperty()
  public comment: string;
  @ApiProperty()
  public nb_passengers: number;
  @ApiProperty()
  public travelId: number;
}
