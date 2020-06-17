// @format
import {pick} from 'lodash';
import {GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList} from 'graphql';

import {retrieveType} from '../../../Types/registry';

const Ingredient = retrieveType('ingredients');

const id = {
  type: GraphQLNonNull(GraphQLID),
  description: 'Dish ID',
};

const searchId = {
  type: GraphQLID,
  description: 'ID of the dish to fetch',
};

const name = {
  type: GraphQLString,
  description: 'Dish name',
};

const ingredients = {
  write: {
    type: GraphQLList(GraphQLID),
    description: 'Ingredients used',
    collection: Ingredient.collectionName,
  },
  read: Ingredient.connection('ingredients'),
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

export const args = {
  ...pick(readable, ['name']),
  id: searchId,
};
