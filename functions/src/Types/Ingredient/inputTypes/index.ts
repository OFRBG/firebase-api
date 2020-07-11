// @format
import { GraphQLInputObjectType } from "graphql";

import { resolveLazy, makeUpdateFields } from "../../../utils";
import { writable } from "../fields";

export const IngredientInput = new GraphQLInputObjectType({
  name: "IngredientInput",
  description: "New ingredient mutation input",
  fields: () => resolveLazy(writable)
});

export const IngredientUpdateInput = new GraphQLInputObjectType({
  name: "IngredientUpdateInput",
  description: "Ingredient update mutation input",
  fields: () => makeUpdateFields(resolveLazy(writable))
});
