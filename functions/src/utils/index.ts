// @format
import {get, has, set} from 'lodash';
import {ObjectSchema} from 'yup';

import * as firestore from './firestore';

export const requireAuth = (currentUser: any) => {
  if (!get(currentUser, 'isAdmin')) {
    throw new Error(`Operation not allowed`);
  }
};

export const flatAwait = async (p: Promise<any[]>) =>
  await Promise.all([].concat(...(await p)));

export const addToCollection = async (
  collectionName: string,
  schema: ObjectSchema<any>,
  root: any,
  args: any,
) => {
  const validated = await schema.validate(args.inputObject);

  return firestore.addToCollection(collectionName, validated);
};

export const fetchFromCollection = async (
  collectionName: string,
  root: any,
  args: any,
  idPath: string,
) => {
  const requestArgs = has(root, idPath)
    ? set(args, 'ids', get(root, idPath))
    : args;

  const fetchedData = firestore.fetchFromCollection(collectionName, requestArgs);

  return await flatAwait(fetchedData);
};

/**
 * Get document data and add its id
 *
 * @param {DocumentSnapshot} doc Fetched document
 * @returns {Object} Document data with its id
 */
export const appendId = (doc: FirebaseFirestore.DocumentSnapshot) => {
  return {...doc.data(), id: doc.id};
};
