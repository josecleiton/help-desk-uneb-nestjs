import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { typeOrmCodeErrors } from '../app.constants';

interface IFilterMap {
  [key: string]: (err: any) => Error;
}

export class TypeOrmExceptionFilter {
  private filter: IFilterMap = {
    [typeOrmCodeErrors.uniqueConstraint]: (err: any): Error => {
      const { detail } = err;
      const key = detail.substring(
        detail.indexOf('(') + 1,
        detail.indexOf(')'),
      );
      return new ConflictException(`${key} already exists`);
    },
  };

  constructor(readonly err: any, context?: string) {
    if (!err.code) {
      throw err;
    }
    const errFunc = this.filter[err.code];
    if (!errFunc) {
      new Logger(context || 'TypeOrmExceptionFilter').error(err);
      throw new InternalServerErrorException();
    }
    throw errFunc(err);
  }
}
