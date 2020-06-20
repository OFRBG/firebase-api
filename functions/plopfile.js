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
          if ((/.+/).test(value)) { return true; }
          return 'Name is required';
        },
        transformer: function(value) {
          return _.startCase(value)
        }
      }, 
      {
        type: 'input',
        name: 'rootName',
        message: 'What should the GraphQL root field be named?',
        default: (ctx) => `${ctx.name}s`,
        validate: function (value) {
          if ((/^.+$/).test(value)) { return true; }
          return 'Root query name is required';
        }
      },
      {
        type: 'input',
        name: 'collectionName',
        message: 'What should the Firestore collection be named?',
        default: (ctx) => ctx.rootName,
        validate: function (value) {
          if ((/.+/).test(value)) { return true; }
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
          return `What does this type represent? ${_.capitalize(ctx.name)} is a`
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
