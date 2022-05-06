import { Compiler } from '../compiler';
import * as nunjucks from 'nunjucks';
import {
  ErrorExtension,
  isTagExtension,
  NunjucksCompilerExtension,
} from './extensions';
import * as transformer from 'nunjucks/src/transformer';
import { walkAst } from './astWalker';
import { ParameterVisitor } from './visitors';

export class NunjucksCompiler implements Compiler {
  public name = 'nunjucks';
  private env: nunjucks.Environment;

  constructor({ loader }: { loader: nunjucks.ILoader }) {
    this.env = new nunjucks.Environment(loader);
    this.loadBuiltInExtensions();
  }

  public compile(template: string): string {
    const ast = nunjucks.parser.parse(template, this.env.extensionsList, {});
    const compiler = new nunjucks.compiler.Compiler(
      'main',
      this.env.opts.throwOnUndefined || false
    );
    const metadata = this.getMetadata(ast);
    const preProcessedAst = this.preProcess(ast);
    compiler.compile(preProcessedAst);
    const code = compiler.getCode();
    return `(() => {${code}})()`;
  }

  public async render<T extends object>(
    templateName: string,
    data: T
  ): Promise<string> {
    return this.env.render(templateName, data);
  }

  public loadExtension(extension: NunjucksCompilerExtension): void {
    if (isTagExtension(extension)) {
      this.env.addExtension(extension.name, extension);
    } else {
      throw new Error('Unsupported extension');
    }
  }

  private loadBuiltInExtensions(): void {
    this.loadExtension(new ErrorExtension());
  }

  private getMetadata(ast: nunjucks.nodes.Node) {
    const parameters = new ParameterVisitor();
    walkAst(ast, [parameters]);
    return {
      parameters: parameters.getParameters(),
    };
  }

  private preProcess(ast: nunjucks.nodes.Node): nunjucks.nodes.Node {
    return transformer.transform(ast, []);
  }
}
