import * as nodemailer from 'nodemailer';
import {
  Processor,
  Process,
  OnQueueWaiting,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

import { emailQueueConfig } from './email.queue.config';
import { IEmailJob } from './email-job.interface.dto';
import { emailConfig, emailFrom } from '../config/email.config';
import { TemplateEmailCompiler } from './template/template.compiler';

@Processor(emailQueueConfig.name)
export class EmailConsumer {
  private logger = new Logger('EmailConsumer');
  private transporter = nodemailer.createTransport(emailConfig);

  constructor(private templateCompiler: TemplateEmailCompiler) {}

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
  async sendEmail(job: Job<IEmailJob>): Promise<void> {
    this.logger.log('Job started');
    const { data } = job;
    const html = this.templateCompiler.compileEmail(data);
    if (!html) {
      const msg =
        'O conteúdo em HTML é requirido. Talvez o caminho esteja incorreto.';
      this.logger.error(msg);
      throw new Error(msg);
    }
    const text = this.templateCompiler.compileEmail(data, true);
    if (!text) {
      this.logger.warn(
        `TemplateView ${data.view} sem a versão text plain
         Toda TemplateView deve ter sua versão em texto.
         Porque isso evita que o email caia em spam`,
      );
    }
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
}
