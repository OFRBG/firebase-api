// @format
import {connectionFromArray, connectionDefinitions, connectionArgs} from 'graphql-relay';
import {merge, get, has, set} from 'lodash';
import {model} from '../type';
import {args} from '../fields';
import {getIngredient} from '../resolvers/resolvers';

const {connectionType} = connectionDefinitions({nodeType: model});

export const connection = (path = 'ingredients') => ({
  type: connectionType,
  description: 'Ingredients connection',
  args: merge({}, args, connectionArgs),
  resolve: async (item: any, args: any) => {
    const requestArgs = has(item, path)
      ? set(args, 'ids', get(item, path))
      : args;

    const nodes = await getIngredient(null, requestArgs, null);

    return connectionFromArray(nodes, args);
  }
});

export const rootConnection = connection();
