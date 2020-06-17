// @format
import {addToCollection, fetchFromCollection} from '../../../utils';
import {schema} from '../type';

export const collectionName = 'dishes';

export const getDish = async (root: any, args: any, context: any) =>
  fetchFromCollection(collectionName, root, args);

export const setDish = async (root: any, args: any, context: any) =>
  addToCollection(collectionName, schema, root, args);
