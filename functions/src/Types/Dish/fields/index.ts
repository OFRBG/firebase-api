// @format
import {GraphQLString, GraphQLList} from 'graphql';

import {Ingredient} from '../../../Types';

const id = {
  type: GraphQLString,
  description: 'Dish ID',
};

const name = {
  type: GraphQLString,
  description: 'Dish name',
};

const ingredients = {
  setter: {
    type: GraphQLList(GraphQLString),
    description: 'Ingredients used',
  },
  getter: Ingredient.resolvers.getIngredient,
};

export const setters = {
  id: id,
  name: name,
  ingredients: ingredients.setter,
};

export const getters = {
  id: id,
  name: name,
  ingredients: ingredients.getter,
};
