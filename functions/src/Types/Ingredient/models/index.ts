// @format
import {GraphQLObjectType} from 'graphql';

import * as fields from '../fields';

export const model = new GraphQLObjectType({
  name: 'ingredient',
  description: 'Ingredient used in dishes',
  fields: fields,
});
