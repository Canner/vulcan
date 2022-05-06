import {
  NunjucksCompiler,
  InMemoryCodeLoader,
} from '@template-engine/compilers/nunjucks';

it('Error extension should throw error with error code and the position while rendering', async () => {
  // Arrange
  const loader = new InMemoryCodeLoader();
  const compiler = new NunjucksCompiler({ loader });
  const { compiledData } = compiler.compile(`
{% error "This is an error" %}
  `);
  // Action, Assert
  loader.setSource('test', compiledData);
  await expect(compiler.render('test', { name: 'World' })).rejects.toThrowError(
    'This is an error at 1:3'
  );
});