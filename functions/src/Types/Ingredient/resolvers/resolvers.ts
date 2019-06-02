// @format
import {fetchFromCollection} from '../../../utils';

const collectionName = 'ingredients';

export const getIngredient = async (root: Object, args: any, context: any) =>
  fetchFromCollection(collectionName, args);
