import { Test, TestingModule } from '@nestjs/testing';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

describe('PhotoController', () => {
  let photoController: PhotoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PhotoController],
      providers: [PhotoService],
    }).compile();

    photoController = app.get<PhotoController>(PhotoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(photoController.getHello()).toBe('Hello World!');
    });
  });
});
