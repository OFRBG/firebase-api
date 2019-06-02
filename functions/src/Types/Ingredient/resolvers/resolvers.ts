// @format
import {clone} from 'lodash';

import {addToCollection, fetchFromCollection} from '../../../utils';
import {schema} from '../models';

const collectionName = 'ingredients';

export const getIngredient = async (root: Object, args: any, context: any) =>
  fetchFromCollection(collectionName, args);

export const setIngredient = async (root: Object, args: any, context: any) => {
  if (await schema.isValid(args.input)) {
    return addToCollection(collectionName, clone(args.input));
  }

  throw new Error(`Invalid input object for schema: ${schema}`);
};
