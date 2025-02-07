import IParseMailTempleteDTO from '../dtos/IParseMalTemplateDTO';
import IMailTempleteProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTempleteProvider {
  public async parse({  }: IParseMailTempleteDTO): Promise<string> {
    return 'Mail Template';
  }
}
export default FakeMailTemplateProvider;
