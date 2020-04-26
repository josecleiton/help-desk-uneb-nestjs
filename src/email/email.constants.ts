import { EmailViews } from './email-views.interface';

export const emailViews: EmailViews = {
  alertSolicitante: {
    view: 'update-state-chamado',
    subject: 'Um assunto',
  },
};

export const hbsHelpers = {
  color: 'colorHelper',
  upperCase: 'upperCaseHelper',
};
