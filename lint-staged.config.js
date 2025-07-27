module.exports = {
    '*.ts': (filenames) => {
        const filesToLint = filenames.filter(
            (file) => !file.startsWith('src/database/migrations/'),
        );
        return filesToLint.length > 0 ? ['eslint --fix', 'git add'] : [];
    },
    '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
        'prettier --write',
    ],
    '*.md': ['prettier --write'],
};
