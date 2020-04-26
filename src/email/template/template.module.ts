import { Module } from '@nestjs/common';
import { TemplateCompiler, TemplateEmailCompiler } from './template.compiler';

@Module({
  providers: [TemplateCompiler, TemplateEmailCompiler],
  exports: [TemplateCompiler, TemplateEmailCompiler],
})
export class TemplateModule {}
