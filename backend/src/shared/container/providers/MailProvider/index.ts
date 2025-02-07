import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailprovider from './models/IMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailprovider>(
  'MailProvider',
  providers[mailConfig.driver],
);
