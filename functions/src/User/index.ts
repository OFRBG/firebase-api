// @format
import * as admin from 'firebase-admin';
import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import {unset} from 'lodash';

const FETCH_LIMIT = 100;

const userFields = {
  language: {
    type: GraphQLString,
    description: 'User content language',
  },
  name: {
    type: GraphQLString,
    description: 'User name or title',
  },
  level: {
    type: GraphQLString,
    description: 'User CEFR level',
  },
  id: {
    type: GraphQLString,
    description: 'Fetching by id ignores the other filter parameters',
  },
};

const UserType = new GraphQLObjectType({
  name: 'user',
  description: 'Language user information',
  fields: () => userFields,
});

/**
 * Apply Firestore filters and return the built Query
 *
 * @param {CollectionReference} db Collection to filter
 * @param {Object} filters Values to use to filter
 * @returns {Query} Firestore Query with the applied filters
 */
const applyFilters = (
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
const buildDocument = (doc: FirebaseFirestore.DocumentSnapshot) => {
  return {...doc.data(), id: doc.id};
};

/**
 * Fetch a document by id
 *
 * @param {CollectionReference} db Collection reference from Firestore
 * @param {String} id id to look up
 * @returns {Object[]} Fetched document
 */
const _getUserById = async (
  db: FirebaseFirestore.CollectionReference,
  id: string,
) => {
  const document = await db.doc(id).get();
  return [buildDocument(document)];
};

/**
 * Fetch documents after applying provided filters
 *
 * @param {Object} args Values used to filter the query
 * @returns {Object[]} Fetched documents after filtering
 */
const _getUsers = async function(args: any, context: any) {
  const db = admin.firestore().collection('users');

  if (args.id) {
    return _getUserById(db, args.id);
  }

  const query = applyFilters(db, args);
  const fetchedData = await query.get();

  return fetchedData.docs.map(buildDocument);
};

/**
 * Set merge a user to Firestore
 * If no id is specified, add new document
 *
 * @param {Object} args User attributes to insert
 * @returns {String} id of the new document
 */
const _setUser = async function(args: any, context: any) {
  const db = admin.firestore().collection('users');
  if (args.id) {
    const customId = args.id;
    unset(args, 'id');

    await db.doc(customId).set({...args}, {merge: true});
    return customId;
  } else {
    const addedUser = await db.add({...args});
    return addedUser.id;
  }
};

/**
 * Delete a user from Firestore
 *
 * @param {Object} args Object with the id of the document to delete
 * @returns {boolean} returns true for a successful operation
 */
const _deleteUser = async function(args: any, context: any) {
  if (!args.id) {
    throw new Error(`No user ID provided!`);
  }

  const db = admin.firestore().collection('users');
  await db.doc(args.id).delete();

  return true;
};

const getUsers = {
  type: new GraphQLList(UserType),
  args: userFields,
  resolve: (root: Object, args: any, context: any) => _getUsers(args, context),
};

const setUser = {
  type: GraphQLString,
  description: 'Add a new user',
  args: userFields,
  resolve: (root: Object, args: any, context: any) => _setUser(args, context),
};

const deleteUser = {
  type: GraphQLBoolean,
  description: 'Delete a user',
  args: {
    id: {
      type: GraphQLString,
    },
  },
  resolve: (root: Object, args: any, context: any) =>
    _deleteUser(args, context),
};

export const User = {
  type: UserType,
  fields: userFields,
  resolvers: {getUsers, setUser, deleteUser},
};
