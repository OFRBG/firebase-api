// @format
import * as admin from 'firebase-admin';
import * as uniqid from 'uniqid';

import {applyFilters} from '../utils';

export const fetchFromCollection = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);

  const query = applyFilters(db, args);
  const fetchedData = await query.get();

  const docs = fetchedData.docs.map(doc => doc.data());

  return docs;
};

export const fetchFromCollectionWithId = async (collection: string, id: string) => {
  return fetchFromCollection(collection, {id});
};

export const addToCollection = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);
  const insertId = uniqid(`app:${collection}:`);

  const docRef = db.doc(insertId);
  await docRef.set({...args, id: insertId});

  const doc = await docRef.get();

  return doc.data();
};
