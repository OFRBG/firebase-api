// @format
import {get} from 'lodash';

const FETCH_LIMIT = 100;

export * from './firestore';

export const requireAuth = (currentUser: any) => {
  if (!get(currentUser, 'isAdmin')) {
    throw new Error(`Operation not allowed`);
  }
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
