import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { IMultipartFile } from './multipart-file.interface';
import { IPersistedFile } from './persisted-file.interface';

@Injectable()
export class UploadService {
  private logger = new Logger('UploadService');
  private basePath = path.join(__dirname, '..', '..', 'public');

  save(file: IMultipartFile): IPersistedFile {
    const filename = uuid() + path.extname(file.originalname);
    const fullPath = path.join(this.basePath, filename);
    this.logger.log(`Salvando arquivo em ${fullPath}`);
    writeFileSync(fullPath, file.buffer);
    return { url: fullPath };
  }
}
