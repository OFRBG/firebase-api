// @format
import * as admin from "firebase-admin";
import { ConnectionArguments } from "graphql-relay";
import { toPairs } from "lodash";
import { v4 as uuid } from "uuid";
import { getQueryParams, applyConnectionArgs } from "./helpers";

const FETCH_LIMIT = 20;

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

export const fetch = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);

  const query = applyFilters(db, args);
  const fetchedData = await query.get();

  const docs = fetchedData.docs.map(doc => doc.data());

  return docs;
};

export const add = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);

  const insertId = `app:${collection}:${uuid()}`;
  const contentType = collection;

  const docRef = db.doc(insertId);
  await docRef.set({ ...args, id: insertId, contentType });

  const doc = await docRef.get();

  return doc.data();
};

export const update = async (collection: string, id: string, args: any) => {
  const db = admin.firestore().collection(collection);

  const docRef = db.doc(id);
  await docRef.set(args, { merge: true });

  const doc = await docRef.get();

  return doc.data();
};

export const remove = async (collection: string, ids: string[]) => {
  const db = admin.firestore().collection(collection);

  const docs = await db.where("id", "in", ids).get();

  const batch = admin.firestore().batch();

  docs.forEach(doc => batch.delete(doc.ref));

  await batch.commit();

  return docs.size;
};

export const addToArray = admin.firestore.FieldValue.arrayUnion;
export const deleteFromArray = admin.firestore.FieldValue.arrayRemove;
