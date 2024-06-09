import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { PhotoDto } from './dtos/photo.dto';
import { Photo } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PhotoService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Photo)
    private repository: Repository<Photo>,
  ) {}

  async findAll(): Promise<PhotoDto[]> {
    const photos = await this.repository.find({});
    return photos.map((photo) => this.mapEntityToDto(photo));
  }

  async sync(): Promise<void> {
    const photos = await lastValueFrom(
      this.httpService
        .post<{ files: string[] }>('https://api.waifu.pics/many/sfw/waifu', {})
        .pipe(
          map((res) =>
            res.data.files.map(
              (file) =>
                ({
                  link: file,
                }) as PhotoDto,
            ),
          ),
        ),
    );

    for (const photo of photos) {
      await this.storePhoto(photo);
    }
  }

  private async storePhoto(photo: PhotoDto) {
    const photoEntity = this.repository.create(photo);
    await this.repository.save(photoEntity);
  }

  private mapEntityToDto(photo: Photo): PhotoDto {
    return { ...photo };
  }
}
