interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      mail: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      mail: 'matheus_boito@hotmail.com',
      name: 'Matheus',
    },
  },
} as IMailConfig;
