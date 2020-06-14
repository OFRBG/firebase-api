// @format
import {GraphQLObjectType} from 'graphql';

import {readable} from '../fields';
import definitions from '../node';

export const model: any = new GraphQLObjectType({
  name: 'Dish',
  description: 'Dish data type',
  interfaces: [definitions.nodeInterface],
  fields: () => readable,
});
