// @format
import {addToCollection, fetchFromCollection} from '../../../utils';
import {schema} from '../type';

const collectionName = 'ingredients';

export const getIngredient = async (root: Object, args: any, context: any) =>
  fetchFromCollection(collectionName, root, args);

export const setIngredient = async (root: Object, args: any, context: any) =>
  addToCollection(collectionName, schema, root, args);
