import { Command } from './base';
import * as inquirer from 'inquirer';
import { promises as fs } from 'fs';
import * as path from 'path';
import { version } from '../../package.json';
import * as ora from 'ora';
import { exec } from 'child_process';
import * as nunjucks from 'nunjucks';
import * as glob from 'glob';

const validators: Record<
  string,
  {
    regex: RegExp;
    errorMessage: string;
  }
> = {
  projectName: {
    regex: /^[a-zA-Z0-9_-]+$/,
    errorMessage: `Project name should contain only letters, numbers, or dashes.`,
  },
};

const validateAnswer = (name: string) => (input: string) => {
  const validator = validators[name];
  if (!validator.regex.test(input)) {
    throw new Error(validator.errorMessage);
  }
  return true;
};

interface InitCommandOptions {
  projectName: string;
  version: string;
}

export class InitCommand extends Command {
  public async handle(options: Partial<InitCommandOptions>): Promise<void> {
    const question = [];

    if (!options.projectName) {
      question.push({
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-first-vulcan-project',
        validate: validateAnswer('projectName'),
      });
    } else {
      validateAnswer('projectName')(options.projectName);
    }

    options = {
      ...{ version },
      ...options,
      ...(await inquirer.prompt(question)),
    };

    await this.createProject(options as InitCommandOptions);
  }

  public async createProject(options: InitCommandOptions): Promise<void> {
    const projectPath = path.resolve(process.cwd(), options.projectName);
    await fs.mkdir(projectPath);
    const existedFiles = await fs.readdir(projectPath);
    if (existedFiles.length > 0)
      throw new Error(`Path ${projectPath} is not empty`);

    const installSpinner = ora('Creating project...').start();
    try {
      await fs.writeFile(
        path.resolve(projectPath, 'package.json'),
        JSON.stringify(
          {
            name: options.projectName,
            dependencies: {
              '@vulcan-sql/core': options.version,
              // TODO: Install build/serve package when they are ready
            },
          },
          null,
          2
        ),
        'utf-8'
      );
      installSpinner.succeed('Project has been created.');
      installSpinner.start('Installing dependencies...');
      await this.execAndWait(`npm install --silent`, projectPath);
      installSpinner.succeed(`Dependencies have been installed.`);
      installSpinner.start('Writing initial content...');
      await this.addInitFiles(projectPath, options);
      installSpinner.succeed('Initial done.');

      this.logger.info(
        `Project has been initialized. Run "cd ${projectPath} && vulcan start" to start the server.`
      );
    } catch (e) {
      installSpinner.fail();
      throw e;
    } finally {
      installSpinner.stop();
    }
  }

  private async execAndWait(command: string, cwd: string) {
    return new Promise<void>((resolve, reject) => {
      exec(command, { cwd }, (error, _, stderr) => {
        if (error) {
          reject(stderr);
        }
        resolve();
      });
    });
  }

  private async addInitFiles(projectPath: string, options: InitCommandOptions) {
    const files = await this.listFiles(
      path.resolve(__dirname, '..', 'schemas', 'init', '**/*.*')
    );
    for (const file of files) {
      const relativePath = path.relative(
        path.resolve(__dirname, '..', 'schemas', 'init'),
        file
      );
      let templateContent = await fs.readFile(file, 'utf8');
      if (path.extname(file) === '.yaml') {
        // Only render yaml files because sql files have some template scripts which are used by Vulcan.
        templateContent = nunjucks.renderString(templateContent, {
          options,
        });
      }
      const targetPath = path.resolve(projectPath, relativePath);
      const dir = path.dirname(targetPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(targetPath, templateContent, 'utf8');
    }
  }

  private async listFiles(path: string) {
    return new Promise<string[]>((resolve, reject) => {
      glob(path, (err, files) => {
        if (err) return reject(err);
        return resolve(files);
      });
    });
  }
}