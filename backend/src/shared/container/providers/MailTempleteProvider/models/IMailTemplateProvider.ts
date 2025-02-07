import IParseMailTemplateDTO from '../dtos/IParseMalTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
