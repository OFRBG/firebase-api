// @format
import * as admin from 'firebase-admin';
import {appendId, applyFilters} from '../utils';

export const fetchFromCollection = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);

  const query = applyFilters(db, args);
  const fetchedData = await query.get();

  return fetchedData.docs.map(appendId);
};

export const addToCollection = async (collection: string, args: any) => {
  const db = admin.firestore().collection(collection);

  const insertedDocRef = await db.add(args);
  const insertedDoc = await insertedDocRef.get();

  return appendId(insertedDoc);
};
