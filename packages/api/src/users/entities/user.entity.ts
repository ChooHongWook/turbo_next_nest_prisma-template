import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  password: string;

  @ApiPropertyOptional({
    description: 'User name',
    example: 'John Doe',
  })
  name: string | null;

  @ApiProperty({
    description: 'Email verification timestamp',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  emailVerified: Date | null;

  refreshToken: string | null;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(data: PrismaUser) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.emailVerified = data.emailVerified;
    this.refreshToken = data.refreshToken;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
