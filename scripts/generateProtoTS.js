const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const protoDir = 'src/grpc/protos'; // Set your proto files directory
const outputDir = 'src/grpc/interfaces'; // Set your output directory

function generateTsFromProto(dir, outDir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      // Recursively call the function if the file is a directory
      const newOutDir = path.join(outDir, file);
      if (!fs.existsSync(newOutDir)) {
        fs.mkdirSync(newOutDir, { recursive: true });
      }
      generateTsFromProto(filePath, newOutDir);
    } else if (path.extname(file) === '.proto') {
      // Generate TypeScript file if the file is a .proto file
      const outputFilePath = path.join(outDir, `${path.basename(file, '.proto')}.ts`);
      const command = `pbjs ${filePath} --ts ${outputFilePath}`;
      try {
        execSync(command);
        console.log(`Generated ${outputFilePath}`);
      } catch (error) {
        console.error(`Error generating ${outputFilePath}: ${error}`);
      }
    }
  });
}

// Start the generation process
generateTsFromProto(protoDir, outputDir);