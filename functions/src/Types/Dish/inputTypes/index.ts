// @format
import { GraphQLInputObjectType } from "graphql";

import { writable } from "../fields";

export const DishInput = new GraphQLInputObjectType({
  name: "DishInput",
  description: "New dish mutation input",
  fields: () => writable
});
