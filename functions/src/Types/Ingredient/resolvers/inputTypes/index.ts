// @format
import {GraphQLInputObjectType} from 'graphql';
import {pick} from 'lodash';

import * as fields from '../../fields';

export const SetIngredientInput = new GraphQLInputObjectType({
  name: 'SetIngredientInput',
  description: 'setIngredient mutation input',
  fields: () => pick(fields, ['name', 'isVegan']),
});
