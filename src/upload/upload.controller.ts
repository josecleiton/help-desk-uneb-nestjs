import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { UploadService } from './upload.service';
import { IMultipartFile } from './multipart-file.interface';
import { IPersistedFile } from './persisted-file.interface';
import { ApiFile } from './api-file.decorator';

const mainRoute = 'upload';
@Controller(mainRoute)
@ApiTags(mainRoute)
export class UploadController {
  private readonly fileField = 'file';
  constructor(private uploadService: UploadService) {}

  @Post()
  @ApiOperation({ description: 'Upload arquivo' })
  @ApiFile(this.fileField)
  @UseInterceptors(FileInterceptor(this.fileField))
  upload(@UploadedFile() file: IMultipartFile): IPersistedFile {
    return this.uploadService.save(file);
  }
}
