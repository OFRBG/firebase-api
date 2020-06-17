// @format
import {model as type} from '../type';
import {IngredientInput as input} from '../inputTypes';

import {setIngredient as resolve} from './resolvers';

const args = {
  inputObject: {
    type: input,
  },
};

export const setter = {type, args, resolve};
