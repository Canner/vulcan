import * as jsYAML from 'js-yaml';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as ora from 'ora';
import { modulePath, logger } from '../utils';
import { handleStop } from './stop';

export interface PackageCommandOptions {
  config: string;
  output: string;
  target: string;
  requireFromLocal?: boolean;
  shouldStopVulcanEngine?: boolean;
  pull?: boolean;
  platform?: string;
}

const defaultOptions: PackageCommandOptions = {
  config: './outputs/api-configs/vulcan.yaml',
  output: 'node',
  target: 'vulcan-server',
};

export const packageVulcan = async (options: PackageCommandOptions) => {
  const configPath = path.resolve(process.cwd(), options.config);
  const config: any = jsYAML.load(await fs.readFile(configPath, 'utf-8'));
  const shouldStopVulcanEngine = options.shouldStopVulcanEngine ?? true;

  if (!config['containerPlatform']) logger.warn(`No container platform specified, use default: linux/amd64`);
  options.platform = config['containerPlatform'] ?? 'linux/amd64';

  // Import dependencies. We use dynamic import here to import dependencies at runtime.
  const { VulcanBuilder } = await import(modulePath('@vulcan-sql/build', options.requireFromLocal));

  // Build project
  const spinner = ora('Packaging project...\n').start();
  try {
    const builder = new VulcanBuilder(config);
    const semantic = await builder.build(
      options.platform,
      options.pull,
      false,
      true,
      options,
    );
    spinner.succeed('Package successfully.');
    if (semantic && shouldStopVulcanEngine) {
      handleStop();
    }
  } catch (e) {
    spinner.fail();
    throw e;
  } finally {
    spinner.stop();
  }
};

export const handlePackage = async (
  options: Partial<PackageCommandOptions>
): Promise<void> => {
  options = {
    ...defaultOptions,
    ...options,
  };
  await packageVulcan(options as PackageCommandOptions);
};
