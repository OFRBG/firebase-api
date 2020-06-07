// @format
import {pick} from 'lodash';
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

export const writable = {
  name: name,
  isVegan: isVegan,
};

export const readable = {
  id: id,
  name: name,
  isVegan: isVegan,
};

export const args = pick(readable, ['name', 'isVegan']);
