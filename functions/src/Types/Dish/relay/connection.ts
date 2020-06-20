// @format
import {connectionFromArray, connectionDefinitions, connectionArgs} from 'graphql-relay';
import {merge} from 'lodash';
import {model} from '../type';
import {args} from '../fields';
import {getDish as getter} from '../resolvers/resolvers';

const {connectionType} = connectionDefinitions({nodeType: model});

export const connection = (path = 'dishes') => ({
  type: connectionType,
  description: 'Dish connection',
  args: merge({}, args, connectionArgs),
  resolve: async (root: any, args: any) => {
    const nodes = await getter(path)(root, args, null);

    return connectionFromArray(nodes, args);
  }
});

export const rootConnection = connection();
