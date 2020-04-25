import { ApiHeaderOptions } from '@nestjs/swagger';

export const cpfLength = 11;
export const customSolicitanteAuthHeader = 'HD7-CPF';
export const solicitanteAuthHeaderSwagger: ApiHeaderOptions = {
  name: customSolicitanteAuthHeader,
  description: 'CPF do Solicitante',
};
