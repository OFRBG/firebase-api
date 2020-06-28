// @format
import { addToCollection, fetchFromCollection } from "../../../utils";
import { schema } from "../type";

export const collectionName = "dishes";

export const getDish = (idPath = collectionName) => async (
  root: any,
  args: any,
  context: any
) => fetchFromCollection(collectionName, root, args, idPath);

export const setDish = async (root: any, args: any, context: any) =>
  addToCollection(collectionName, schema, root, args);
