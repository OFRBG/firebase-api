// @format
import {GraphQLList} from 'graphql';

import {getters as fields} from '../fields';
import {model} from '../type';

import * as resolvers from './resolvers';
import * as inputTypes from './inputTypes';

export const getIngredient = {
  type: new GraphQLList(model),
  args: fields,
  resolve: resolvers.getIngredient,
};

export const setIngredient = {
  type: model,
  args: {
    input: {
      type: inputTypes.SetIngredientInput,
    },
  },
  resolve: resolvers.setIngredient,
};
