import { ApiProperty } from '@nestjs/swagger';

export class Link {
  @ApiProperty({
    description: 'Link ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Link URL',
    example: 'https://example.com',
  })
  url: string;

  @ApiProperty({
    description: 'Link title',
    example: 'My Awesome Link',
  })
  title: string;

  @ApiProperty({
    description: 'Link description',
    example: 'This is a great resource',
  })
  description: string;
}
