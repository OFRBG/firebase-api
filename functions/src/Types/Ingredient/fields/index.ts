// @format
import {GraphQLString, GraphQLBoolean} from 'graphql';

const id = {
  type: GraphQLString,
  description: 'Ingredient ID',
};

const name = {
  type: GraphQLString,
  description: 'Ingredient name',
};

const isVegan = {
  type: GraphQLBoolean,
  description: 'Whether the ingredient is vegan',
};

export const setters = {
  name: name,
  isVegan: isVegan,
};

export const getters = {
  id: id,
  name: name,
  isVegan: isVegan,
};
