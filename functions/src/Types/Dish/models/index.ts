// @format
import {GraphQLObjectType} from 'graphql';

import * as fields from '../fields';

export const model = new GraphQLObjectType({
  name: 'dish',
  description: 'Dish data type',
  fields: () => fields,
});
