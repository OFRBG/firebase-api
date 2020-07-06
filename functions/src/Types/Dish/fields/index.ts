// @format
import { pick } from "lodash";
import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from "graphql";

import { retrieveType } from "../../../Types/registry";

const Ingredient = retrieveType("ingredients");

const id = {
  type: GraphQLNonNull(GraphQLID),
  description: "Dish ID"
};

const searchId = {
  type: GraphQLID,
  description: "ID of the dish to fetch"
};

const contentType = {
  type: GraphQLString,
  description: "Content type"
};

const name = {
  type: GraphQLString,
  description: "Dish name"
};

const ingredients = {
  write: {
    type: GraphQLList(GraphQLID),
    description: "Ingredients used",
    collection: Ingredient.collectionName,
    useSubcollection: false
  },
  read: Ingredient.connection("ingredients")
};

export const writable = {
  name,
  ingredients: ingredients.write
};

export const readable = {
  id,
  name,
  contentType,
  ingredients: ingredients.read
};

export const args = {
  ...pick(readable, ["name"]),
  id: searchId
};
