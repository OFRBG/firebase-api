// @format
import {fetchFromCollectionWithId} from '../../../utils/firestore';

import {addToCollection, fetchFromCollection} from '../../../utils';
import {schema} from '../type';

const collectionName = 'ingredients';

export const getIngredientWithId = async (id: string) =>
  fetchFromCollectionWithId(collectionName, id);

export const getIngredient = async (root: any, args: any, context: any) =>
  fetchFromCollection(collectionName, root, args);

export const setIngredient = async (root: any, args: any, context: any) =>
  addToCollection(collectionName, schema, root, args);
