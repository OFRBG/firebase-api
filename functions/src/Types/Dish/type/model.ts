// @format
import {GraphQLObjectType} from 'graphql';

import {readable} from '../fields';
import {nodeInterface} from '../../../utils/node';

export const model: any = new GraphQLObjectType({
  name: 'Dish',
  description: 'Dish data type',
  interfaces: [nodeInterface],
  fields: () => readable,
});
