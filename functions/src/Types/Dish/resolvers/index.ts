// @format
import {GraphQLList} from 'graphql';
import {omit} from 'lodash';

import * as fields from '../fields';
import * as models from '../models';

import * as resolvers from './resolvers';

export const getDish = {
  type: new GraphQLList(models.model),
  args: omit(fields, 'ingredients'),
  resolve: resolvers.getDish,
};
