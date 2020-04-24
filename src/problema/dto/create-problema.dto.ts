import { IsString } from 'class-validator';

export class CreateProblemaDto {
  @IsString()
  descricao: string;
}
