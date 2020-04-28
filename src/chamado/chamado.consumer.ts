import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { ChamadoGateway } from './chamado.gateway';
import { chamadoQueueConfig, chamadoQueueEvents } from './chamado.queue.config';

@Processor(chamadoQueueConfig.name)
export class ChamadoConsumer {
  private logger = new Logger('ChamadoConsumer');

  constructor(private chamadoGateway: ChamadoGateway) {}

  @OnQueueFailed()
  onFaileD(job: Job, err: Error) {
    this.logger.error(
      `Job #${job.id} falhou. Data: ${JSON.stringify(job.data)}`,
    );
    this.logger.error(err);
  }

  @Process(chamadoQueueEvents.broadcastChamados)
  async broadcastChamados(job: Job<number>) {
    this.logger.log('broadcastChamados começou');
    const { data: setorId } = job;
    await this.chamadoGateway.broadcastChamados(setorId);
  }
}
