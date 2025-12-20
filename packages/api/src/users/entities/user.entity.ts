import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser } from '@repo/database/client';

export class User implements PrismaUser {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email verification timestamp',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  emailVerified: Date | null;

  constructor(data: PrismaUser) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.emailVerified = data.emailVerified;
  }
}
