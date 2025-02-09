import path from 'node:path';

export const PRIVATE_MODULES = [
  {
    path: path.resolve(__dirname, '../modules/cms/cms.module'),
    configKey: 'privateModules.cms',
  },
  // Add more private modules here
];
