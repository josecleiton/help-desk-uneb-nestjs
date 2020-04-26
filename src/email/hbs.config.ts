
import * as hbs from 'handlebars';
import { hbsHelpers } from './email.constants';
hbs.registerHelper(hbsHelpers.color, function(): string {
  return `"color: ${this.color};"`;
});

hbs.registerHelper(hbsHelpers.upperCase, function(v: string): string {
  return v.toUpperCase();
});

export default hbs;
