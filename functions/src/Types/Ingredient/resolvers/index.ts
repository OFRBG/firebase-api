// @format
import {GraphQLList} from 'graphql';

import * as fields from '../fields';
import * as models from '../models';

import * as resolvers from './resolvers';

export const getIngredient = {
  type: new GraphQLList(models.model),
  args: fields,
  resolve: resolvers.getIngredient,
};
