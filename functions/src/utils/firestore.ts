// @format
import * as admin from 'firebase-admin';
import {toPairs, isString} from 'lodash';
import { v4 as uuid } from 'uuid';
import {connectionArgs} from 'graphql-relay';

type FirestoreOp = [string, string, string | string[]];

const FETCH_LIMIT = 20;

const getSimpleQuery = (value: string, field: string): FirestoreOp =>
  [value, '==', field];

const getArrayQuery = (field: string, value: string | string[]): FirestoreOp =>
  field[0] === '-' 
    ? [field.slice(1), 'array-contains', value]
    : [field, 'in', value];

const getQueryParams = (arg: string, reference: string | string[]): FirestoreOp =>
  arg[0] !== '*' && isString(reference)
    ? getSimpleQuery(arg, reference)
    : getArrayQuery(arg.slice(1), reference);

/**
 * Apply Firestore filters and return the built Query
 *
 * @param {CollectionReference} db Collection to filter
 * @param {Object} filters Values to use to filter
 * @returns {Query} Firestore Query with the applied filters
 */
export const applyFilters = (
  db: FirebaseFirestore.CollectionReference,
  filters: {[key: string]: string},
) => {
  let query = db.limit(FETCH_LIMIT);

  for (const [arg, value] of toPairs(filters)) {
    if (connectionArgs[arg]) continue;

    // @ts-ignore
    query = query.where(...getQueryParams(arg, value));
  }

  return query;
};

export const fetchFromCollection = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);

  const query = applyFilters(db, args);
  const fetchedData = await query.get();

  const docs = fetchedData.docs.map(doc => doc.data());

  return docs;
};

export const addToCollection = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);
  const insertId = `app:${collection}:${uuid()}`;

  const docRef = db.doc(insertId);
  await docRef.set({...args, id: insertId});

  const doc = await docRef.get();

  return doc.data();
};
