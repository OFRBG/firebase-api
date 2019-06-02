// @format
import {GraphQLList} from 'graphql';

import * as fields from '../fields';
import {model} from '../models';

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
