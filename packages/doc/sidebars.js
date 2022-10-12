/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually

  tutorialSidebar: [
    'intro',
    'quickstart',
    'installation',
    {
      type: 'category',
      label: 'Building APIs',
      items: [
        {
          type: 'category',
          label: 'Configuration',
          link: { type: 'doc', id: 'api-building/configuration' },
          items: [
            {
              type: 'doc',
              id: 'api-building/configuration/api-schema',
            },
            {
              type: 'doc',
              id: 'api-building/configuration/data-source-profile',
            },
          ],
        },
        {
          type: 'category',
          label: 'Writing SQL',
          link: { type: 'doc', id: 'api-building/writing-sql' },
          items: [
            {
              type: 'doc',
              id: 'api-building/sql-syntax',
            },
            {
              type: 'doc',
              id: 'api-building/predefined-queries',
            },
          ],
        },
        {
          type: 'doc',
          id: 'api-building/build-from-dbt',
        },
        {
          type: 'category',
          label: 'API Validation',
          link: { type: 'doc', id: 'api-building/api-validation' },
          items: [
            {
              type: 'doc',
              id: 'api-building/api-validation/validation-filter',
            },
          ]
        },
        {
          type: 'doc',
          id: 'api-building/error-response',
        },
        {
          type: 'doc',
          id: 'api-building/api-document',
        },
        {
          type: 'category',
          label: 'Access Control',
          link: { type: 'doc', id: 'api-building/access-control' },
          items: [
            {
              type: 'category',
              label: 'Authenticator',
              link: {
                type: 'doc',
                id: 'api-building/access-control/authenticator',
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'api-building/access-control/authenticators',
                },
              ],
            },
            {
              type: 'doc',
              id: 'api-building/access-control/authorization',
            },
          ],
        },
        {
          type: 'doc',
          id: 'api-building/api-versioning',
        },
        {
          type: 'doc',
          id: 'api-building/access-log',
        },
        {
          type: 'doc',
          id: 'api-building/cors',
        },
        {
          type: 'doc',
          id: 'api-building/response-format',
        },
        {
          type: 'doc',
          id: 'api-building/rate-limit',
        },
      ],
    },
    {
      type: 'category',
      label: 'Catalog',
      link: { type: 'doc', id: 'catalog/catalog-intro' },
      items: [
        {
          type: 'doc',
          id: 'catalog/catalog-intro',
        },
      ],
    },
    {
      type: 'category',
      label: 'Connectors',
      link: { type: 'doc', id: 'connectors' },
      items: [
        {
          type: 'doc',
          id: 'connectors/postgresql',
          label: 'PostgreSQL',
        },
        {
          type: 'doc',
          id: 'connectors/duckdb',
          label: 'DuckDB',
        },
      ],
    },
    'deployment',
    {
      type: 'category',
      label: 'Extensions',
      link: { type: 'doc', id: 'extensions' },
      items: [
        {
          type: 'category',
          label: '@vulcan-sql/core',
          link: { type: 'doc', id: 'extensions/vulcan-sql-core' },
          items: [
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/code-loader',
              label: 'CodeLoader',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/data-source',
              label: 'DataSource',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/decorator',
              label: 'Decorator',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/filter-builder',
              label: 'FilterBuilder',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/filter-runner',
              label: 'FilterRunner',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/input-validator',
              label: 'InputValidator',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/persistent-store',
              label: 'PersistentStore',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/profile-reader',
              label: 'ProfileReader',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/serializer',
              label: 'Serializer',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/tag-builder',
              label: 'TagBuilder',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/tag-runner',
              label: 'TagRunner',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/template-engine',
              label: 'TemplateEngine',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-core/template-provider',
              label: 'TemplateProvider',
            },
          ],
        },
        {
          type: 'category',
          label: '@vulcan-sql/build',
          link: { type: 'doc', id: 'extensions/vulcan-sql-build' },
          items: [
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-build/packager',
              label: 'Packager',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-build/schema-reader',
              label: 'SchemaReader',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-build/spec-generator',
              label: 'SpecGenerator',
            },
          ],
        },
        {
          type: 'category',
          label: '@vulcan-sql/serve',
          link: { type: 'doc', id: 'extensions/vulcan-sql-serve' },
          items: [
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-serve/authenticator',
              label: 'BaseAuthenticator',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-serve/document-router',
              label: 'DocumentRouter',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-serve/response-formatter',
              label: 'BaseResponseFormatter',
            },
            {
              type: 'doc',
              id: 'extensions/vulcan-sql-serve/route-middleware',
              label: 'BaseRouteMiddleware',
            },
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
