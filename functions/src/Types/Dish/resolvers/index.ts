// @format
import {model as type} from '../type';
import {DishInput as input} from '../inputTypes';

import {setDish as resolve} from './resolvers';

const args = {
  inputObject: {
    type: input,
  },
};

export const setter = {type, args, resolve};
