import * as path from 'path';
import hbs from './hbs.config';
import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { EmailJob } from '../email-job.interface.dto';

@Injectable()
export class TemplateCompiler {
  protected basePath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'resources',
    'views',
  );
  private logger = new Logger('TemplateCompiler');

  compile(view: string, data: unknown, text?: boolean): string {
    const file = `${view}${text ? '.text' : ''}.hbs`;
    const fullPath = path.join(this.basePath, file);
    const source = readFileSync(fullPath);
    if (!source) {
      return null;
    }
    this.logger.log(`Template ${fullPath} foi compilado.`);
    const template = hbs.compile(source.toString());
    return template(data);
  }
}

export class TemplateEmailCompiler extends TemplateCompiler {
  constructor() {
    super();
    this.basePath = path.join(this.basePath, 'emails');
  }

  compileEmail(data: EmailJob, text?: boolean): string {
    const vars = { ...data.vars, person: data.person };
    return super.compile(data.view, vars, text);
  }
}
