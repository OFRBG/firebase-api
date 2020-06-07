// @format
import {GraphQLObjectType} from 'graphql';

import {readable} from '../fields';

export const model = new GraphQLObjectType({
  name: 'Ingredient',
  description: 'Ingredient used in dishes',
  fields: readable,
});
