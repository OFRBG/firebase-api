// @format
import {GraphQLObjectType} from 'graphql';

import {readable} from '../fields';
import {nodeInterface} from '../node';

export const model = new GraphQLObjectType({
  name: 'Ingredient',
  description: 'Ingredient used in dishes',
  interfaces: [nodeInterface],
  fields: readable,
});
