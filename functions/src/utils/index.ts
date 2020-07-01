// @format
import { get, set, first, last, isFunction, mapValues } from "lodash";
import { ObjectSchema } from "yup";

import * as firestore from "./firestore";

export const requireAuth = (currentUser: any) => {
  if (!get(currentUser, "isAdmin")) {
    throw new Error(`Operation not allowed`);
  }
};

/**
 * Map lazy value to their values
 */
export const resolveLazy = <T>(values: { [key: string]: T | (() => T) }) =>
  mapValues(values, value => (isFunction(value) ? value() : value));

/**
 * Check if the parameter is a reverse relation
 *
 * @param {string} path
 * @returns {boolean}
 */
const isReverseSearch = (path: string) => path[0] === "-";

/**
 * Get document data and add its id
 *
 * @param {DocumentSnapshot} doc Fetched document
 * @returns {Object} Document data with its id
 */
export const appendId = (doc: FirebaseFirestore.DocumentSnapshot) => {
  return { ...doc.data(), id: doc.id };
};

/**
 * Build relay response object from Firestore docs
 *
 * @param {Documents[]} nodes
 * @returns {Connection}
 */
export const buildRelayConnection = (
  nodes: FirebaseFirestore.DocumentData[]
) => ({
  edges: nodes.map(node => ({
    cursor: node.id,
    node
  })),
  pageInfo: {
    startCursor: get(first(nodes), "id", null),
    endCursor: get(last(nodes), "id", null),
    hasNextPage: false,
    hasPreviousPage: false
  }
});

/**
 * Fetch a document from a Firestore collection
 */
export const fetch = async (
  collectionName: string,
  root: any,
  args: any,
  idPath = collectionName
): Promise<FirebaseFirestore.DocumentData[]> => {
  if (root) {
    isReverseSearch(idPath)
      ? set(args, `*${idPath}`, get(root, "id"))
      : set(args, "*id", get(root, idPath));
  }

  return firestore.fetch(collectionName, args);
};

/**
 * Add a document to a Firestore collection
 */
export const add = async (
  collectionName: string,
  root: any,
  args: any,
  schema: () => ObjectSchema<any>
) => {
  const validated = await schema().validate(args.inputObject);

  return firestore.add(collectionName, validated);
};

/**
 * Update a Firestore document in a collection
 */
export const update = async (
  collectionName: string,
  root: any,
  args: any,
  id: string,
  schema: () => ObjectSchema<any>
) => {
  const validated = await schema().validate(args.inputObject, {
    context: { isUpdate: true }
  });

  return firestore.update(collectionName, id, validated);
};

/**
 * Delete a Firestore document in a collection
 */
export const remove = async (collectionName: string, root: any, args: any) => {
  const { ids = [] } = args;

  return firestore.remove(collectionName, ids);
};
