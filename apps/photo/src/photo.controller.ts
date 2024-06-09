import { Controller, Get, Post } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoDto } from './dtos/photo.dto';

@Controller({ path: 'photos' })
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  get(): Promise<PhotoDto[]> {
    return this.photoService.findAll();
  }

  @Post('/sync')
  syncPhoto(): Promise<void> {
    return this.photoService.sync();
  }
}
