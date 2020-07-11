// @format
import { add, fetch, remove, update } from "../../../utils";
import { schema } from "../type";

export const collectionName = "ingredients";

export const getIngredient = (idPath = collectionName) => async (
  root: any,
  args: any,
  context: any
) => fetch(collectionName, root, args, idPath);

export const setIngredient = async (root: any, args: any, context: any) =>
  add(collectionName, root, args, schema);

export const updateIngredient = async (root: any, args: any, context: any) =>
  update(collectionName, root, args, args.id, schema);

export const removeIngredient = async (root: any, args: any, context: any) =>
  remove(collectionName, root, args);
