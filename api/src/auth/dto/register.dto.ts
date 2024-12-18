import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  public email: string;
  @ApiProperty({
    description:
      'Does contain at least 12 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
  })
  public password: string;
  @ApiProperty()
  public firstname: string;
  @ApiProperty()
  public lastname: string;
}
