// @format
import { isString } from "lodash";

type FirestoreOp = [string, string, string | string[]];

const getSimpleQuery = (value: string, field: string): FirestoreOp => [
  value,
  "==",
  field
];

const getArrayQuery = (field: string, value: string | string[]): FirestoreOp =>
  field[0] === "-"
    ? [field.slice(1), "array-contains", value]
    : [field, "in", value];

export const getQueryParams = (
  arg: string,
  reference: string | string[]
): FirestoreOp =>
  arg[0] !== "*" && isString(reference)
    ? getSimpleQuery(arg, reference)
    : getArrayQuery(arg.slice(1), reference);

/**
 * Apply pagination args where possible
 *
 * @param {Query} query Firestore Query with the applied filters
 * @param {string} after
 * @param {string} before
 * @param {string} first
 * @param {string} last
 * @returns {Query} query Firestore Query with pagination
 */
export const applyConnectionArgs = (
  query: FirebaseFirestore.Query,
  after?: string | null,
  before?: string | null,
  first?: number | null,
  last?: number | null
) => {
  if (after || first) {
    query = query.orderBy("id");

    query = after ? query.startAfter(after) : query;
    query = first ? query.limit(first) : query;

    return query;
  }

  if (before || last) {
    query = query.orderBy("id", "desc");

    query = before ? query.startAfter(before) : query;
    query = last ? query.limit(last) : query;

    return query;
  }

  return query;
};
