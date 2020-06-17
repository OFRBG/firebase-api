// @format
import {GraphQLObjectType} from 'graphql';

import {readable} from '../fields';

export const model: any = new GraphQLObjectType({
  name: 'Dish',
  description: 'Dish data type',
  fields: () => readable,
});
