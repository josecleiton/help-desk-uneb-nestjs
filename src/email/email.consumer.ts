import hbs from './hbs.config';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import {
  Processor,
  Process,
  OnQueueWaiting,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { readFileSync } from 'fs';
import { Logger } from '@nestjs/common';

import { emailQueueConfig } from './email.queue.config';
import { EmailJob } from './email-job.interface.dto';
import { emailConfig, emailFrom } from '../config/email.config';

@Processor(emailQueueConfig.name)
export class EmailConsumer {
  private basePath = path.join(
    __dirname,
    '..',
    '..',
    'resources',
    'views',
    'emails',
  );
  private logger = new Logger('EmailConsumer');
  private transporter = nodemailer.createTransport(emailConfig);

  @OnQueueWaiting()
  onWaiting(jobId: number) {
    this.logger.log(`Job #${jobId} waiting`);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed.`);
    console.error('Reason:', err);
  }

  @Process()
  async sendEmail(job: Job<EmailJob>): Promise<void> {
    this.logger.log('Job started');
    const { data } = job;
    const html = this.compileTemplate(job.data);
    if (!html) {
      const msg = `O conteúdo em HTML é requirido. Talvez o caminho esteja incorreto.`;
      this.logger.error(msg);
      throw new Error(msg);
    }
    const text = this.compileTemplate(data, true);
    const { person, subject } = data;
    const info = await this.transporter.sendMail({
      from: emailFrom,
      to: person.email,
      subject,
      text,
      html,
    });
    this.logger.log(JSON.stringify(info));
  }

  private compileTemplate(data: EmailJob, text?: boolean): string {
    const file = `${data.view}${text ? '.text' : ''}.hbs`;
    const source = readFileSync(path.join(this.basePath, file));
    if (!source) {
      return null;
    }
    const template = hbs.compile(source.toString());
    const { vars, person } = data;

    const dataTest = { ...vars, person };
    console.log(dataTest);
    return template(dataTest);
  }
}
