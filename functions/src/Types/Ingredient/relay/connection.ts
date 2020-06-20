// @format
import {connectionFromArray, connectionDefinitions, connectionArgs} from 'graphql-relay';
import {merge} from 'lodash';
import {model} from '../type';
import {args} from '../fields';
import {getIngredient as getter} from '../resolvers/resolvers';

const {connectionType} = connectionDefinitions({nodeType: model});

export const connection = (path = 'ingredients') => ({
  type: connectionType,
  description: 'Ingredients connection',
  args: merge({}, args, connectionArgs),
  resolve: async (root: any, args: any) => {
    const nodes = await getter(path)(root, args, null);

    return connectionFromArray(nodes, args);
  }
});

export const rootConnection = connection();
