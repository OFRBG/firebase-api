// @format
import {GraphQLList} from 'graphql';
import {pick} from 'lodash';

import {getters as fields} from '../fields';
import {model} from '../type';

import * as resolvers from './resolvers';
import * as inputTypes from './inputTypes';

export const getDish = {
  type: new GraphQLList(model),
  args: pick(fields, ['id', 'name']),
  resolve: resolvers.getDish,
};

export const setDish = {
  type: model,
  args: {
    input: {
      type: inputTypes.SetDishInput,
    },
  },
  resolve: resolvers.setDish,
};
