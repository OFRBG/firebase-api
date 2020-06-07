// @format
import {pick} from 'lodash';
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
  write: {
    type: GraphQLList(GraphQLString),
    description: 'Ingredients used',
  },
  read: Ingredient.resolvers.getter,
};

export const writable = {
  name: name,
  ingredients: ingredients.write,
};

export const readable = {
  id: id,
  name: name,
  ingredients: ingredients.read,
};

export const args = pick(readable, ['id', 'name']);
