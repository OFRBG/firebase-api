// @format
import {GraphQLObjectType} from 'graphql';

import {readable} from '../fields';

export const model = new GraphQLObjectType({
  name: 'Dish',
  description: 'Dish data type',
  fields: () => readable,
});
