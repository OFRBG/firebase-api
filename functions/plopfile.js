const _ = require('lodash');

module.exports = function (plop) {
  plop.setHelper('lowerCase', text => text.toLowerCase());

  plop.setGenerator('type', {
    description: 'API Type files',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the type?',
        validate: function (value) {
          if ((/^.+$/).test(value)) { return true; }
          return 'Name is required';
        },
        transformer: function(value) {
          return _.startCase(value).replace(/\s/g, '');
        }
      }, 
      {
        type: 'input',
        name: 'rootName',
        message: 'What should the GraphQL root field be named?',
        default: (ctx) => `${_.camelCase(ctx.name)}s`,
        validate: function (value) {
          if ((/^.+$/).test(value)) { return true; }
          return 'Root query name is required';
        },
        transformer: function(value) {
          return _.camelCase(value);
        }
      },
      {
        type: 'input',
        name: 'collectionName',
        message: 'What should the Firestore collection be named?',
        default: (ctx) => _.kebabCase(ctx.rootName),
        validate: function (value) {
          if ((/^.+$/).test(value)) { return true; }
          return `Collection name is required.`;
        },
        transformer: function(value) {
          return _.kebabCase(value)
        }
      }, 
      {
        type: 'input',
        name: 'description',
        message: function(ctx) {
          return `What does this type represent? ${_.startCase(ctx.name)} is a`
        },
        validate: function (value) {
          if ((/^.+$/).test(value)) { return true; }
          return 'Description is required';
        }
      },
      {
        type: 'confirm',
        name: 'depends',
        message: 'Does this type depend on other types?',
        default: false,
      }
    ],
    actions: [{
      type: 'addMany',
      destination: 'src/Types/{{properCase name}}',
      templateFiles: 'generators/type/**/*.hbs',
      base: 'generators/type',
      stripExtensions: ['hbs'],
      abortOnFail: true,
      verbose: true,
    }]
  });
};
