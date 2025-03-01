import path from 'node:path';

export const PRIVATE_MODULES = [
  {
    path: path.resolve(__dirname, '../modules/cms/cms.module'),
    configKey: 'CMS_ENABLED',
  },
  // Add more private modules here
];
