// @format
import {connectionFromArray, connectionDefinitions, connectionArgs} from 'graphql-relay';
import {merge, has, set} from 'lodash';
import {model} from '../type';
import {args} from '../fields';
import {getDish} from '../resolvers/resolvers';

const {connectionType} = connectionDefinitions({nodeType: model});

export const connection = (path = 'dishes') => ({
  type: connectionType,
  description: 'Dish connection',
  args: merge({}, args, connectionArgs),
  resolve: async (item, args) => {
    const requestArgs = has(item, path)
      ? set(args, 'ids', get(item, path))
      : args;

    const nodes = await getDish(null, requestArgs);

    return connectionFromArray(nodes, args);
  }
});

export const rootConnection = connection();