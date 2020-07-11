// @format
import {
  get,
  set,
  first,
  last,
  isFunction,
  mapValues,
  has,
  isArray,
  transform,
  clone,
  cloneDeep
} from "lodash";
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
 * Transform write fields into update fields
 *
 * @param {any} fields Object of fields
 */
export const makeUpdateFields = (fields: any) =>
  transform(cloneDeep(fields), (result: any, value: any, key: string) => {
    if (value.collection) {
      const copied = clone(value);
      result[`${key}Add`] = copied;
      result[`${key}Remove`] = copied;
    } else {
      result[key] = value;
    }
  });

/**
 * Check if the root object has an array at the given path
 *
 * @param {Object} root GraphQL root object to check
 * @param {String} idPath Path of the array with IDs
 */
const rootHasIdArray = (root: any, idPath: string): boolean =>
  has(root, idPath) && isArray(get(root, idPath));

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
  let collectionPath = collectionName;

  if (root) {
    if (rootHasIdArray(root, idPath)) {
      set(args, `*id`, get(root, idPath));
    } else {
      collectionPath = `${root.contentType}/${root.id}/${collectionName}`;
    }
  }

  return firestore.fetch(collectionPath, args);
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
