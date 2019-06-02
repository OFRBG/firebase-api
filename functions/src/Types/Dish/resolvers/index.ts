// @format
import {GraphQLList} from 'graphql';
import {pick} from 'lodash';

import * as fields from '../fields';
import * as models from '../models';

import * as resolvers from './resolvers';

export const getDish = {
  type: new GraphQLList(models.model),
  args: pick(fields, ['id', 'name']),
  resolve: resolvers.getDish,
};
