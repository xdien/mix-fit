module.exports = {
  '*.ts': (filenames) => {
    const filesToLint = filenames.filter(
      (file) => !file.startsWith('src/database/migrations/'),
    );
    return filesToLint.length > 0 ? ['eslint --fix', 'git add'] : [];
  },
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
    'yarn lint:prettier --parser json',
  ],
  //   'package.json': ['yarn lint:prettier'],
  //   '*.md': ['yarn lint:markdownlint', 'yarn lint:prettier'],
};
