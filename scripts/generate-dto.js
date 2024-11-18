const fs = require('fs-extra');
const path = require('path');
const { Parser } = require('node-sql-parser');

const sqlDir = path.join(__dirname, '../src/database/sql/iot');
const outputDir = path.join(__dirname, '../src/modules/iot/dtos');

async function generateDtos() {
  const parser = new Parser();
  const sqlFiles = await fs.readdir(sqlDir);

  for (const file of sqlFiles) {
    if (path.extname(file) === '.sql') {
      const filePath = path.join(sqlDir, file);
      const sqlContent = await fs.readFile(filePath, 'utf8');
      const cleanedSQL = preprocessSQL(sqlContent);
      const ast = parser.astify(cleanedSQL);

      for (const statement of ast) {
        if (statement.type === 'create') {
          // check id statement is a table array then generate DTO else skip
          if (!statement.table || !Array.isArray(statement.table)) {
            continue;
          }
          const tableName = statement.table[0].table;
          const dtoName = toPascalCase(tableName) + 'Dto';
          // TODO: table name should be '-' instead of '_'
          const dtoFileName = snakeToKebab(tableName) + '.dto.ts';
          const dtoFilePath = path.join(outputDir, dtoFileName);

          // Filter valid columns
          const validColumns = statement.create_definitions.filter(
            (column) => column.column && column.definition,
          );

          let dtoContent = generateDtoContent(dtoName, validColumns);
          // check if DTO file already exists then skip
          if (await fs.pathExists(dtoFilePath)) {
            console.log(`DTO file ${dtoFileName} already exists.`);
            continue;
          }
          await fs.outputFile(dtoFilePath, dtoContent);
        }
      }
    }
  }
  console.log('DTOs generated successfully.');
}

function preprocessSQL(sqlContent) {
  let cleanedSQL = sqlContent.replace(/--.*$/gm, '');
  cleanedSQL = cleanedSQL.replace(/\/\*[\s\S]*?\*\//gm, '');
  cleanedSQL = cleanedSQL.replace(/drop index.*?;/gi, '');
  return cleanedSQL;
}

function toPascalCase(str) {
  return str.replace(/(^\w|_\w)/g, (match) =>
    match.replace('_', '').toUpperCase(),
  );
}

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function snakeToKebab(str) {
  return str.replace(/_/g, '-');
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

function generateDtoContent(dtoName, columns) {
  let content = `import { AbstractDto } from '../../../common/dto/abstract.dto';\n`;
  content += `import {\n  BooleanFieldOptional,\n  EmailFieldOptional,\n  EnumFieldOptional,\n  PhoneFieldOptional,\n  StringFieldOptional,\n} from '../../../decorators';\n\n`;
  content += `export class ${dtoName} extends AbstractDto {\n`;

  for (const column of columns) {
    const columnName = toCamelCase(column.column.column);
    const columnType = mapSQLTypeToTS(column.definition.dataType);
    content += `  @${columnType === 'string' ? 'StringFieldOptional' : columnType.charAt(0).toUpperCase() + columnType.slice(1) + 'FieldOptional'}({ nullable: true })\n`;
    content += `  ${columnName}?: ${columnType} | null;\n\n`;
  }

  content += `  constructor(entity: any) {\n`;
  content += `    super(entity);\n`;
  for (const column of columns) {
    const columnName = toCamelCase(column.column.column);
    content += `    this.${columnName} = entity.${columnName};\n`;
  }
  content += `  }\n`;
  content += `}\n`;

  return content;
}

generateDtos().then(() => console.log('DTOs generated successfully.'));
