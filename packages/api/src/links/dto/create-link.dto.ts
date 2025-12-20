import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty({
    description: 'Link title',
    example: 'My Awesome Link',
  })
  title: string;

  @ApiProperty({
    description: 'Link URL',
    example: 'https://example.com',
  })
  url: string;

  @ApiProperty({
    description: 'Link description',
    example: 'This is a great resource',
  })
  description: string;
}
