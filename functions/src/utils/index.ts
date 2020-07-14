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
  cloneDeep,
  isString,
  isNil
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
): Promise<
  FirebaseFirestore.DocumentData[] | FirebaseFirestore.DocumentData | undefined
> => {
  let collectionPath = collectionName;

  if (!isNil(root)) {
    if (!has(root, idPath)) {
      collectionPath = `${root.contentType}/${root.id}/${collectionName}`;
    } else {
      const relatedIdField = get(root, idPath);

      if (isArray(relatedIdField)) set(args, `*id`, relatedIdField);
      else if (isString(relatedIdField)) set(args, `id`, relatedIdField);
      else throw new Error("ID field has an unsupported type");
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
