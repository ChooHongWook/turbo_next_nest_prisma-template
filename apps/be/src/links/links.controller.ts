import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateLinkDto, UpdateLinkDto, Link } from '@repo/api';

import { LinksService } from './links.service';

@ApiTags('links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiResponse({
    status: 201,
    description: 'Link created successfully',
    type: Link,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all links' })
  @ApiResponse({ status: 200, description: 'List of all links', type: [Link] })
  findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a link by ID' })
  @ApiResponse({ status: 200, description: 'Link found', type: Link })
  @ApiResponse({ status: 404, description: 'Link not found' })
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a link' })
  @ApiResponse({
    status: 200,
    description: 'Link updated successfully',
    type: Link,
  })
  @ApiResponse({ status: 404, description: 'Link not found' })
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(+id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link' })
  @ApiResponse({
    status: 200,
    description: 'Link deleted successfully',
    type: Link,
  })
  @ApiResponse({ status: 404, description: 'Link not found' })
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
