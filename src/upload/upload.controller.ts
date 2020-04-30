import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiConsumes,
} from '@nestjs/swagger';

import { UploadService } from './upload.service';
import { IMultipartFile } from './multipart-file.interface';
import { PersistedFileDto } from './persisted-file.dto';
import { ApiFile } from './api-file.decorator';

const mainRoute = 'upload';
@Controller(mainRoute)
@ApiTags(mainRoute)
export class UploadController {
  private readonly fileField = 'file';
  constructor(private uploadService: UploadService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor(this.fileField))
  @ApiOperation({ description: 'Upload arquivo' })
  @ApiConsumes('multipart/form-data')
  @ApiFile(this.fileField)
  @ApiCreatedResponse({ type: PersistedFileDto })
  upload(@UploadedFile() file: IMultipartFile): PersistedFileDto {
    return this.uploadService.save(file);
  }
}
