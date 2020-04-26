import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { emailQueueConfig } from './email.queue.config';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.consumer';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [BullModule.registerQueue(emailQueueConfig), TemplateModule],
  providers: [EmailService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
