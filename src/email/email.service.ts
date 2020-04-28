import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { emailQueueConfig } from './email.queue.config';
import { QueuePriority } from '../util/queue-priority.enum';
import { IEmailJob } from './email-job.interface.dto';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');
  constructor(@InjectQueue(emailQueueConfig.name) private emailQueue: Queue) {}

  async sendEmail(data: IEmailJob): Promise<Job<IEmailJob>> {
    this.logger.log(`Enviando email para ${JSON.stringify(data.person)}`);
    const job = await this.emailQueue.add(data, {
      priority: QueuePriority.NORMAL,
      attempts: 2,
    });
    return job;
  }
}
