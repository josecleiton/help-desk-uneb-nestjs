import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (filename = 'file'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [filename]: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo binário. Deve ser enviado usando FormData',
        },
      },
    },
  })(target, propertyKey, descriptor);
};
