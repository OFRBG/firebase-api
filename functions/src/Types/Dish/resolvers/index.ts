// @format
import {GraphQLList} from 'graphql';

import {args} from '../fields';
import {model} from '../type';
import * as inputTypes from '../inputTypes';

import * as resolvers from './resolvers';

export const getter = {
  type: new GraphQLList(model),
  args: args,
  resolve: resolvers.getDish,
};

export const setter = {
  type: model,
  args: {
    input: {
      type: inputTypes.SetDishInput,
    },
  },
  resolve: resolvers.setDish,
};
