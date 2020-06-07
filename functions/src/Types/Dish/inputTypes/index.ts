// @format
import {GraphQLInputObjectType} from 'graphql';

import {writable} from '../fields';

export const SetDishInput = new GraphQLInputObjectType({
  name: 'SetDishInput',
  description: 'setDish mutation input',
  fields: () => writable,
});
