// @format
import { addToCollection, fetchFromCollection } from "../../../utils";
import { schema } from "../type";

export const collectionName = "ingredients";

export const getIngredient = (idPath = collectionName) => async (
  root: any,
  args: any,
  context: any
) => fetchFromCollection(collectionName, root, args, idPath);

export const setIngredient = async (root: any, args: any, context: any) =>
  addToCollection(collectionName, schema, root, args);
