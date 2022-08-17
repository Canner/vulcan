import { TYPES } from '@vulcan-sql/core/types';
import {
  CodeLoader,
  ITemplateEngineOptions,
  TemplateProvider,
} from '@vulcan-sql/core/models';
import {
  InMemoryCodeLoader,
  NunjucksCompiler,
  Compiler,
  TemplateEngine,
} from '@vulcan-sql/core/template-engine';
import { AsyncContainerModule, interfaces } from 'inversify';
import { TemplateEngineOptions } from '../../options';
import * as nunjucks from 'nunjucks';

export const templateEngineModule = (options: ITemplateEngineOptions = {}) =>
  new AsyncContainerModule(async (bind) => {
    // Options
    bind<ITemplateEngineOptions>(
      TYPES.TemplateEngineInputOptions
    ).toConstantValue(options);
    bind<ITemplateEngineOptions>(TYPES.TemplateEngineOptions)
      .to(TemplateEngineOptions)
      .inSingletonScope();

    // TemplateProvider
    bind<interfaces.AutoNamedFactory<TemplateProvider>>(
      TYPES.Factory_TemplateProvider
    ).toAutoNamedFactory<TemplateProvider>(TYPES.Extension_TemplateProvider);

    if (options.provider) {
      bind<TemplateProvider>(TYPES.TemplateProvider)
        .toDynamicValue((context) => {
          const factory = context.container.get<
            interfaces.AutoNamedFactory<TemplateProvider>
          >(TYPES.Factory_TemplateProvider);
          return factory(options.provider!);
        })
        .inSingletonScope();
    }

    // Compiler environment
    bind<nunjucks.Environment>(TYPES.CompilerEnvironment)
      .toDynamicValue((context) => {
        // We only need loader in runtime
        const codeLoader = context.container.get<CodeLoader>(
          TYPES.CompilerLoader
        );

        return new nunjucks.Environment(codeLoader);
      })
      .inSingletonScope()
      .whenTargetNamed('runtime');

    bind<nunjucks.Environment>(TYPES.CompilerEnvironment)
      .toDynamicValue(() => {
        return new nunjucks.Environment();
      })
      .inSingletonScope()
      .whenTargetNamed('compileTime');

    // Loader
    bind<interfaces.AutoNamedFactory<CodeLoader>>(
      TYPES.Factory_CompilerLoader
    ).toAutoNamedFactory(TYPES.Extension_CompilerLoader);
    bind<CodeLoader>(TYPES.CompilerLoader)
      .toDynamicValue((context) => {
        const loaderFactory = context.container.get<
          interfaces.AutoNamedFactory<CodeLoader>
        >(TYPES.Factory_CompilerLoader);
        const options = context.container.get<TemplateEngineOptions>(
          TYPES.TemplateEngineOptions
        );
        return loaderFactory(options.codeLoader);
      })
      .inSingletonScope();

    // Compiler
    bind<Compiler>(TYPES.Compiler).to(NunjucksCompiler).inSingletonScope();

    // Template Engine
    bind<TemplateEngine>(TYPES.TemplateEngine)
      .to(TemplateEngine)
      .inSingletonScope();
  });
