// @format
import * as admin from "firebase-admin";
import { ConnectionArguments } from "graphql-relay";
import { toPairs, partition, has, fromPairs } from "lodash";
import { v4 as uuid } from "uuid";
import { getQueryParams, applyConnectionArgs } from "./helpers";

const FETCH_LIMIT = 20;

const partitionSubcollectionFields = (args: any) =>
  partition(toPairs(args), ([, arg]) => has(arg, "collection"));

const handleSubcollections = (
  docRef: FirebaseFirestore.DocumentReference
) => async ([key, ids]: [string, any]) => {
  const sub = docRef.collection(ids.collection);

  const docs = await Promise.all(
    ids.map(async (id: string) => {
      const source = await admin
        .firestore()
        .doc(`${ids.collection}/${id}`)
        .get();

      const docData = source.data();

      if (!docData)
        throw new Error(`Referenced document "${id}" does not exist.`);

      await sub.doc(id).set(docData);

      return docData;
    })
  );

  return [key, docs];
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

export const fetch = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);

  if (args.id) {
    const doc = await db.doc(args.id).get();
    return doc.data();
  }

  const query = applyFilters(db, args);
  const fetchedData = await query.get();

  const docs = fetchedData.docs.map(doc => doc.data());

  return docs;
};

export const add = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);
  const [subcollectionFields, fields] = partitionSubcollectionFields(args);

  const insertId = `app:${collection}:${uuid()}`;
  const contentType = collection;

  const docRef = db.doc(insertId);
  await docRef.set({ ...fromPairs(fields), id: insertId, contentType });

  try {
    await Promise.all(subcollectionFields.map(handleSubcollections(docRef)));

    const doc = await docRef.get();

    return { ...doc.data(), ...fromPairs(subcollectionFields) };
  } catch (error) {
    await docRef.delete();

    throw error;
  }
};

export const update = async (collection: string, id: string, args: any) => {
  const db = admin.firestore().collection(collection);
  const group = admin.firestore().collectionGroup(collection);

  const [subcollectionFields, fields] = partitionSubcollectionFields(args);

  const docRef = db.doc(id);
  await docRef.set(fromPairs(fields), { merge: true });

  const relatedUpdates: any[] = [];

  group
    .where("id", "==", id)
    .get()
    .then(docs => {
      docs.forEach(doc => {
        relatedUpdates.push(doc.ref.set(fromPairs(fields), { merge: true }));
      });
    });

  await Promise.all(relatedUpdates);

  try {
    await Promise.all(subcollectionFields.map(handleSubcollections(docRef)));

    const doc = await docRef.get();

    return { ...doc.data(), ...fromPairs(subcollectionFields) };
  } catch (error) {
    await docRef.delete();

    throw error;
  }
};

export const remove = async (collection: string, ids: string[]) => {
  const db = admin.firestore().collection(collection);
  const group = admin.firestore().collectionGroup(collection);

  const docs = await db.where("id", "in", ids).get();
  const linkedDocs = await group.where("id", "in", ids).get();

  const batch = admin.firestore().batch();

  docs.forEach(doc => batch.delete(doc.ref));
  linkedDocs.forEach(doc => batch.delete(doc.ref));

  await batch.commit();

  return docs.size;
};

export const addToArray = admin.firestore.FieldValue.arrayUnion;
export const deleteFromArray = admin.firestore.FieldValue.arrayRemove;
