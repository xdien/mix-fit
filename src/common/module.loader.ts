import * as fs from 'node:fs';
import * as path from 'node:path';

import type { DynamicModule } from '@nestjs/common';
import { Logger } from '@nestjs/common';

export class ModuleLoader {
  private static logger = new Logger('ModuleLoader');

  static async loadPrivateModule(
    modulePath: string,
    moduleConfig: any,
  ): Promise<DynamicModule | null> {
    try {
      // Kiểm tra xem module có tồn tại không
      const fullPath = path.join(process.cwd(), modulePath);

      if (!fs.existsSync(fullPath)) {
        this.logger.log(`Module at ${modulePath} does not exist, skipping...`);

        return null;
      }

      // Dynamic import module
      const module = await import(fullPath);
      const moduleKeys = Object.keys(module);

      if (moduleKeys.length === 0) {
        throw new Error(`Module at ${modulePath} does not export any classes`);
      }

      const ModuleClass = module[moduleKeys[0] as keyof typeof module];

      if (!ModuleClass?.register) {
        this.logger.warn(
          `Module at ${modulePath} does not have register method`,
        );

        return null;
      }

      return ModuleClass.register(moduleConfig);
    } catch (error) {
      this.logger.warn(
        `Failed to load module at ${modulePath}: ${error.message}`,
      );

      return null;
    }
  }
}
