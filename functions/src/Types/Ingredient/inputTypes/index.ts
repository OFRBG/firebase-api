// @format
import {GraphQLInputObjectType} from 'graphql';

import {writable} from '../fields';

export const SetIngredientInput = new GraphQLInputObjectType({
  name: 'SetIngredientInput',
  description: 'setIngredient mutation input',
  fields: () => writable,
});
