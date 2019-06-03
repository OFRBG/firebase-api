// @format
import {clone, get} from 'lodash';
import {ObjectSchema} from 'yup';

const FETCH_LIMIT = 20;

import * as firestore from './firestore';

export const requireAuth = (currentUser: any) => {
  if (!get(currentUser, 'isAdmin')) {
    throw new Error(`Operation not allowed`);
  }
};

export const flatAwait = async (p: any) =>
  await Promise.all([].concat(...(await p)));

export const addToCollection = async (
  collectionName: string,
  schema: ObjectSchema<any>,
  root: Object,
  args: any,
) => {
  if (await schema.isValid(args.input))
    return firestore.addToCollection(collectionName, clone(args.input));

  throw new Error(`Invalid input object ${args.input} for schema ${schema}`);
};

export const fetchFromCollection = async (
  collectionName: string,
  root: Object,
  args: any,
) => {
  const ids = get(root, collectionName);

  const fetchedData = ids
    ? flatAwait(
        ids.map((id: string) =>
          firestore.fetchFromCollection(collectionName, {id, ...args})),
      )
    : firestore.fetchFromCollection(collectionName, args);

  return await flatAwait(fetchedData);
};

/**
 * Apply Firestore filters and return the built Query
 *
 * @param {CollectionReference} db Collection to filter
 * @param {Object} filters Values to use to filter
 * @returns {Query} Firestore Query with the applied filters
 */
export const applyFilters = (
  db: FirebaseFirestore.CollectionReference,
  filters: Object,
) => {
  let query = db.limit(FETCH_LIMIT);

  for (const [arg, value] of Object.entries(filters)) {
    query = query.where(arg, '==', value);
  }

  return query;
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
