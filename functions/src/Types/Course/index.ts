// @format
import * as admin from 'firebase-admin';
import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import {get, unset} from 'lodash';

const FETCH_LIMIT = 100;

const courseFields = {
  language: {
    type: GraphQLString,
    description: 'Course content language',
  },
  name: {
    type: GraphQLString,
    description: 'Course name or title',
  },
  level: {
    type: GraphQLString,
    description: 'Course CEFR level',
  },
  id: {
    type: GraphQLString,
    description: 'Fetching by id ignores the other filter parameters',
  },
};

const CourseType = new GraphQLObjectType({
  name: 'course',
  description: 'Language course information',
  fields: () => courseFields,
});

const requireAuth = (currentUser: any) => {
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
const appendId = (doc: FirebaseFirestore.DocumentSnapshot) => {
  return {...doc.data(), id: doc.id};
};

/**
 * Fetch a document by id
 *
 * @param {CollectionReference} db Collection reference from Firestore
 * @param {String} id id to look up
 * @returns {Object[]} Fetched document
 */
const _getCourseById = async (
  db: FirebaseFirestore.CollectionReference,
  id: string,
) => {
  const document = await db.doc(id).get();
  return [appendId(document)];
};

/**
 * Fetch documents after applying provided filters
 *
 * @param {Object} args Values used to filter the query
 * @returns {Object[]} Fetched documents after filtering
 */
const _getCourses = async function(args: any, context: any) {
  const db = admin.firestore().collection('courses');

  if (args.id) {
    return _getCourseById(db, args.id);
  }

  const query = applyFilters(db, args);
  const fetchedData = await query.get();

  return fetchedData.docs.map(appendId);
};

/**
 * Set merge a course to Firestore
 * If no id is specified, add new document
 *
 * @param {Object} args Course attributes to insert
 * @returns {String} id of the new document
 */
const _setCourse = async function(args: any, context: any) {
  requireAuth(context.currentUser);

  const db = admin.firestore().collection('courses');
  if (args.id) {
    const customId = args.id;
    unset(args, 'id');

    await db.doc(customId).set({...args}, {merge: true});
    return customId;
  } else {
    const addedCourse = await db.add({...args});
    return addedCourse.id;
  }
};

/**
 * Delete a course from Firestore
 *
 * @param {Object} args Object with the id of the document to delete
 * @returns {boolean} returns true for a successful operation
 */
const _deleteCourse = async function(args: any, context: any) {
  requireAuth(context.currentUser);

  if (!args.id) {
    throw new Error(`No course ID provided!`);
  }

  const db = admin.firestore().collection('courses');

  const docReference = db.doc(args.id);
  const doc = await docReference.get();

  await db.doc(args.id).delete();

  return doc;
};

const getCourses = {
  type: new GraphQLList(CourseType),
  args: courseFields,
  resolve: (root: Object, args: any, context: any) =>
    _getCourses(args, context),
};

const setCourse = {
  type: GraphQLString,
  description: 'Add a new course',
  args: courseFields,
  resolve: (root: Object, args: any, context: any) => _setCourse(args, context),
};

const deleteCourse = {
  type: GraphQLBoolean,
  description: 'Delete a course',
  args: {
    id: {
      type: GraphQLString,
    },
  },
  resolve: (root: Object, args: any, context: any) =>
    _deleteCourse(args, context),
};

export const Course = {
  type: CourseType,
  fields: courseFields,
  resolvers: {getCourses, setCourse, deleteCourse},
};
