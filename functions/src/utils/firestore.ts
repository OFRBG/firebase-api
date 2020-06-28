// @format
import * as admin from "firebase-admin";
import { ConnectionArguments } from "graphql-relay";
import { toPairs, isString } from "lodash";
import { v4 as uuid } from "uuid";

type FirestoreOp = [string, string, string | string[]];

const FETCH_LIMIT = 20;

const getSimpleQuery = (value: string, field: string): FirestoreOp => [
  value,
  "==",
  field
];

const getArrayQuery = (field: string, value: string | string[]): FirestoreOp =>
  field[0] === "-"
    ? [field.slice(1), "array-contains", value]
    : [field, "in", value];

const getQueryParams = (
  arg: string,
  reference: string | string[]
): FirestoreOp =>
  arg[0] !== "*" && isString(reference)
    ? getSimpleQuery(arg, reference)
    : getArrayQuery(arg.slice(1), reference);

/**
 * Apply pagination args where possible
 *
 * @param {Query} query Firestore Query with the applied filters
 * @param {string} after
 * @param {string} before
 * @param {string} first
 * @param {string} last
 * @returns {Query} query Firestore Query with pagination
 */
const applyConnectionArgs = (
  query: FirebaseFirestore.Query,
  after?: string | null,
  before?: string | null,
  first?: number | null,
  last?: number | null
) => {
  if (after || first) {
    query = query.orderBy("id");

    query = after ? query.startAfter(after) : query;
    query = first ? query.limit(first) : query;

    return query;
  }

  if (before || last) {
    query = query.orderBy("id", "desc");

    query = before ? query.startAfter(before) : query;
    query = last ? query.limit(last) : query;

    return query;
  }

  return query;
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
  args: ConnectionArguments
) => {
  let query = db.limit(FETCH_LIMIT);
  const { after, before, first, last, ...filters } = args;

  for (const [arg, value] of toPairs(filters)) {
    const params = getQueryParams(arg, value);
    console.log(params);

    // @ts-ignore
    query = query.where(...params);
  }

  return applyConnectionArgs(query, after, before, first, last);
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
  const contentType = collection;

  const docRef = db.doc(insertId);
  await docRef.set({ ...args, id: insertId, contentType });

  const doc = await docRef.get();

  return doc.data();
};

export const updateDocument = async (
  collection: string,
  id: string,
  args: any
) => {
  const db = admin.firestore().collection(collection);

  const docRef = db.doc(id);
  await docRef.set(args, { merge: true });

  const doc = await docRef.get();

  return doc.data();
};

export const addToArray = admin.firestore.FieldValue.arrayUnion;
export const removeFromArray = admin.firestore.FieldValue.arrayRemove;
