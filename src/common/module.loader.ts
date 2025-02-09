import * as fs from 'node:fs';

import type { DynamicModule } from '@nestjs/common';

export class ModuleLoader {
  static async loadPrivateModule(
    modulePath: string,
    config: { enable: boolean; config: any },
  ): Promise<DynamicModule | null> {
    console.log('Trying to load module from:', modulePath);
    console.log('Current directory:', process.cwd());

    const tsPath = `${modulePath}.ts`;
    const jsPath = `${modulePath}.js`;
    const distJsPath = modulePath
      .replace('src/', 'dist/')
      .replace('.ts', '.js');

    console.log('Checking paths:', {
      tsPath,
      jsPath,
      distJsPath,
      tsExists: fs.existsSync(tsPath),
      jsExists: fs.existsSync(jsPath),
      distExists: fs.existsSync(distJsPath),
    });

    try {
      if (
        !fs.existsSync(tsPath) &&
        !fs.existsSync(jsPath) &&
        !fs.existsSync(distJsPath)
      ) {
        console.log(`Module at ${modulePath} does not exist`);

        return null;
      }

      let moduleFile;

      if (fs.existsSync(distJsPath)) {
        moduleFile = await import(distJsPath);
      } else if (fs.existsSync(jsPath)) {
        moduleFile = await import(jsPath);
      } else {
        moduleFile = await import(tsPath);
      }

      if (!moduleFile?.default) {
        throw new Error(
          `Module at ${modulePath} does not have a default export`,
        );
      }

      const ModuleClass = moduleFile.default;

      if (!config.enable) {
        console.log('Module is disabled via config');

        return null;
      }

      return ModuleClass.register
        ? ModuleClass.register(config.config)
        : { module: ModuleClass };
    } catch (error) {
      console.error('Error loading module:', error);

      return null;
    }
  }
}
