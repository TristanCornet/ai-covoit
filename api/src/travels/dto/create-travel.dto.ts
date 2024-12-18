import { ApiProperty } from '@nestjs/swagger';

export class CreateTravelDto {
  @ApiProperty()
  public description: string;
  @ApiProperty()
  public start_location: string;
  @ApiProperty()
  public end_location: string;
  @ApiProperty()
  public date: string;
  @ApiProperty()
  public price: number;
  @ApiProperty()
  public capacity: number;
  @ApiProperty()
  public detour_allowed: boolean;
  @ApiProperty()
  public userId: string;
}
