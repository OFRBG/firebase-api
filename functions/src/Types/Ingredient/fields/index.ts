// @format
import {GraphQLString, GraphQLBoolean} from 'graphql';

export const id = {
  type: GraphQLString,
  description: 'Ingredient ID',
};

export const name = {
  type: GraphQLString,
  description: 'Ingredient name',
};

export const isVegan = {
  type: GraphQLBoolean,
  description: 'Whether the ingredient is vegan',
};
