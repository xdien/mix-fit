const fs = require('fs-extra');
const path = require('path');
const { Parser } = require('node-sql-parser');

const sqlDir = path.join(__dirname, '../src/database/sql/iot');
const outputDir = path.join(__dirname, '../src/modules/iot');

async function generateEntities() {
  try {
    const files = await fs.readdir(sqlDir);
    const parser = new Parser();

    for (const file of files) {
      if (path.extname(file) === '.sql') {
        const filePath = path.join(sqlDir, file);
        const sqlContent = await fs.readFile(filePath, 'utf-8');
        const cleanedSQL = preprocessSQL(sqlContent);
        console.log(cleanedSQL);

        try {
          const parsedSQL = parser.astify(cleanedSQL);

          parsedSQL.forEach((statement) => {
            if (statement.type === 'create' && statement.keyword === 'table') {
              const tableName = statement.table[0].table;
              const entityName = toPascalCase(tableName);
              const entityFileName = `${entityName}.entity.ts`;
              const entityFilePath = path.join(outputDir, entityFileName);
              console.log(
                `Generating entity for table ${tableName}...`,
                statement.create_definitions,
              );
              const columns = statement.create_definitions
                .filter((column) => column.column)
                .map((column) => {
                  console.log('cot ', column.column.column);
                  const columnName = column.column.column;
                  const columnType = mapSQLTypeToTS(column.definition.dataType);
                  return `  @Column()\n  ${columnName}: ${columnType};`;
                })
                .join('\n\n');

              const entityContent = `
import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity({ name: '${tableName}' })
export class ${entityName} extends AbstractEntity {
${columns}
}
              `.trim();

              fs.outputFile(entityFilePath, entityContent);
            }
          });
        } catch (parseError) {
          console.error(`Error parsing SQL file ${file}:`, parseError);
        }
      }
    }
  } catch (err) {
    console.error('Error reading SQL directory:', err);
  }
}

function preprocessSQL(sqlContent) {
  // Remove comments
  let cleanedSQL = sqlContent.replace(/--.*$/gm, '');
  cleanedSQL = cleanedSQL.replace(/\/\*[\s\S]*?\*\//gm, '');

  // Remove unsupported statements (e.g., DROP INDEX)
  cleanedSQL = cleanedSQL.replace(/drop index.*?;/gi, '');

  return cleanedSQL;
}

function toPascalCase(str) {
  return str.replace(/(^\w|_\w)/g, (match) =>
    match.replace('_', '').toUpperCase(),
  );
}

function mapSQLTypeToTS(sqlType) {
  switch (sqlType.toLowerCase()) {
    case 'int':
    case 'integer':
      return 'number';
    case 'varchar':
    case 'text':
      return 'string';
    case 'boolean':
      return 'boolean';
    default:
      return 'any';
  }
}

generateEntities().then(() => console.log('Entities generated successfully.'));
