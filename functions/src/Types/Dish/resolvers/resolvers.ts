// @format
import {addToCollection, fetchFromCollection} from '../../../utils';
import {schema} from '../type';

const collectionName = 'dishes';

export const getDish = async (root: Object, args: any, context: any) =>
  fetchFromCollection(collectionName, root, args);

export const setDish = async (root: Object, args: any, context: any) =>
  addToCollection(collectionName, schema, root, args);
