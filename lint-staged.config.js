module.exports = {
    '*.ts': (filenames) => {
        const filesToLint = filenames.filter(
            (file) => !file.startsWith('src/database/migrations/'),
        );
        return filesToLint.length > 0 ? ['eslint --fix', 'git add'] : [];
    },
    '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
        'npm run lint:fix --parser json',
    ],
    //   'package.json': ['npm run lint:fix'],
    //   '*.md': ['npm run lint:fix'],
};
