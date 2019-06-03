// @format
import {GraphQLObjectType} from 'graphql';

import {getters as fields} from '../fields';

export const model = new GraphQLObjectType({
  name: 'Ingredient',
  description: 'Ingredient used in dishes',
  fields: fields,
});
