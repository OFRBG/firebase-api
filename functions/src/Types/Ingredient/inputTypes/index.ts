// @format
import {GraphQLInputObjectType} from 'graphql';

import {writable} from '../fields';

export const IngredientInput = new GraphQLInputObjectType({
  name: 'IngredientInput',
  description: 'New ingredient mutation input',
  fields: () => writable,
});
