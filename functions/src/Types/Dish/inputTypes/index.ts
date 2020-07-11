// @format
import { GraphQLInputObjectType } from "graphql";

import { resolveLazy, makeUpdateFields } from "../../../utils";
import { writable } from "../fields";

export const DishInput = new GraphQLInputObjectType({
  name: "DishInput",
  description: "New dish mutation input",
  fields: () => resolveLazy(writable)
});

export const DishUpdateInput = new GraphQLInputObjectType({
  name: "DishUpdateInput",
  description: "Dish update mutation input",
  fields: () => makeUpdateFields(resolveLazy(writable))
});
