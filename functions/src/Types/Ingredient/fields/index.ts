// @format
import { pick } from "lodash";
import {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean
} from "graphql";

const id = {
  type: GraphQLNonNull(GraphQLID),
  description: "Ingredient ID"
};

const searchId = {
  type: GraphQLID,
  description: "ID of the ingredient to fetch"
};

const contentType = {
  type: GraphQLString,
  description: "Content type"
};

const name = {
  type: GraphQLString,
  description: "Ingredient name"
};

const isVegan = {
  type: GraphQLBoolean,
  description: "Whether the ingredient is vegan"
};

export const writable = {
  name,
  isVegan
};

export const readable = {
  id,
  contentType,
  name,
  isVegan
};

export const args = {
  ...pick(readable, ["name", "isVegan"]),
  id: searchId
};
