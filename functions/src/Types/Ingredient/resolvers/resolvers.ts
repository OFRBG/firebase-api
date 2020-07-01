// @format
import { add, fetch } from "../../../utils";
import { schema } from "../type";

export const collectionName = "ingredients";

export const getIngredient = (idPath = collectionName) => async (
  root: any,
  args: any,
  context: any
) => fetch(collectionName, root, args, idPath);

export const setIngredient = async (root: any, args: any, context: any) =>
  add(collectionName, schema, root, args);
