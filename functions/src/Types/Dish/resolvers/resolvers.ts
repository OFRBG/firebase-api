// @format
import { add, fetch } from "../../../utils";
import { schema } from "../type";

export const collectionName = "dishes";

export const getDish = (idPath = collectionName) => async (
  root: any,
  args: any,
  context: any
) => fetch(collectionName, root, args, idPath);

export const setDish = async (root: any, args: any, context: any) =>
  add(collectionName, schema, root, args);
