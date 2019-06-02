// @format
import {fetchFromCollection} from '../../../utils';

const collectionName = 'dishes';

export const getDish = async (root: Object, args: any, context: any) =>
  fetchFromCollection(collectionName, args);
