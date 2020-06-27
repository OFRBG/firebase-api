// @format
import {get, set, first, last} from 'lodash';
import {ObjectSchema} from 'yup';

import * as firestore from './firestore';

export const requireAuth = (currentUser: any) => {
  if (!get(currentUser, 'isAdmin')) {
    throw new Error(`Operation not allowed`);
  }
};

export const flatAwait = async (p: Promise<any[]>) =>
  await Promise.all([].concat(...(await p)));

export const updateDocument = async (
  collectionName: string,
  id: string,
  schema: ObjectSchema<any>,
  root: any,
  args: any,
) => {
  const validated = await schema.validate(args.inputObject, {context: {isUpdate: true}});

  return firestore.updateDocument(collectionName, id, validated);
};

export const addToCollection = async (
  collectionName: string,
  schema: ObjectSchema<any>,
  root: any,
  args: any,
) => {
  const validated = await schema.validate(args.inputObject);

  return firestore.addToCollection(collectionName, validated);
};

const isReverseSearch = (path: string) => path[0] === '-';

export const fetchFromCollection = async (
  collectionName: string,
  root: any,
  args: any,
  idPath: string,
) => {
  if (root) {
    isReverseSearch(idPath)
      ? set(args, `*${idPath}`, get(root, 'id'))
      : set(args, '*id', get(root, idPath));
  }

  const fetchedData = firestore.fetchFromCollection(
    collectionName,
    args
  );

  return await flatAwait(fetchedData);
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

/**
 * Build relay response object from Firestore docs
 *
 * @param {Documents[]} nodes
 * @returns {Connection}
 */
export const buildRelayConnection = (nodes) => ({
  edges: nodes.map(node => ({
    cursor: node.id,
    node,
  })),
  pageInfo: {
    startCursor: get(first(nodes), 'id', null),
    endCursor: get(last(nodes), 'id', null),
    hasNextPage: false,
    hasPreviousPage: false,
  }
});
