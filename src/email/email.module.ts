import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { emailQueueConfig } from './email.queue.config';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.consumer';

@Module({
  imports: [BullModule.registerQueue(emailQueueConfig)],
  providers: [EmailService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
