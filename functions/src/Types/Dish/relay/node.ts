import {nodeDefinitions} from 'graphql-relay';
import {identity} from 'lodash';

import {model} from '../type';
import {fetchById} from '../resolvers/resolvers';

export const {nodeField, nodeInterface} = nodeDefinitions(
  fetchById,
  identity(model)
);
