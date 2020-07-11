// @format
import { add, fetch, remove, update } from "../../../utils";
import { schema } from "../type";

export const collectionName = "dishes";

export const getDish = (idPath = collectionName) => async (
  root: any,
  args: any,
  context: any
) => fetch(collectionName, root, args, idPath);

export const setDish = async (root: any, args: any, context: any) =>
  add(collectionName, root, args, schema);

export const updateDish = async (root: any, args: any, context: any) =>
  update(collectionName, root, args, args.id, schema);

export const removeDish = async (root: any, args: any, context: any) =>
  remove(collectionName, root, args);
