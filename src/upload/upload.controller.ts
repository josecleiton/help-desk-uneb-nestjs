import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { MultipartFile } from './multipart-file.interface';
import { PersistedFile } from './persisted-file.interface';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: MultipartFile): PersistedFile {
    return this.uploadService.save(file);
  }
}
