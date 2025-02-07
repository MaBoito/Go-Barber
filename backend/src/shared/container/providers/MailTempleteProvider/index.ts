import { container } from 'tsyringe';

import IMailTemplateprovider from './models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateprovider>(
  'MailTemplateProvider',
  providers.handlebars,
);
