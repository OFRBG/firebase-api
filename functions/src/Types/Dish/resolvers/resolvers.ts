// @format
import {addToCollection, fetchFromCollection} from '../../../utils';
import {fetchFromCollectionWithId} from '../../../utils/firestore';
import {schema} from '../type';

const collectionName = 'dishes';

export const getDishWithId = async (id: string) =>
  fetchFromCollectionWithId(collectionName, id);

export const getDish = async (root: any, args: any, context: any) =>
  fetchFromCollection(collectionName, root, args);

export const setDish = async (root: any, args: any, context: any) =>
  addToCollection(collectionName, schema, root, args);
