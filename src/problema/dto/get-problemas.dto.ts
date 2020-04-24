import { IsString, IsOptional, MinLength } from 'class-validator';
import { searchQueryParamMinLength } from '../problema.constants';

export class GetProblemasDto {
  @IsOptional()
  @IsString()
  @MinLength(searchQueryParamMinLength)
  search: string;
}
