// @format
import {GraphQLInputObjectType} from 'graphql';
import {pick} from 'lodash';

import {setters as fields} from '../../fields';

export const SetDishInput = new GraphQLInputObjectType({
  name: 'SetDishInput',
  description: 'setDish mutation input',
  fields: () => pick(fields, ['name', 'ingredients']),
});
