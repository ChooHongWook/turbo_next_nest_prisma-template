import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    required: false,
    example: 'John Doe',
  })
  name?: string;

  @ApiProperty({
    description: 'User email address',
    required: false,
    example: 'john@example.com',
  })
  email?: string;

  @ApiProperty({
    description: 'Email verification timestamp',
    required: false,
    type: Date,
  })
  emailVerified?: Date;
}
