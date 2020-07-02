// @format
import { GraphQLList, GraphQLID, GraphQLInt } from "graphql";

import { model as type } from "../type";
import { args as getterArgs } from "../fields";
import { IngredientInput as inputType } from "../inputTypes";

import { setIngredient as setterResolve } from "./resolvers";
import { getIngredient as getterResolve } from "./resolvers";
import { removeIngredient as deleterResolve } from "./resolvers";

const setterArgs = {
  inputObject: {
    type: inputType
  }
};

const deleterArgs = {
  ids: {
    type: GraphQLList(GraphQLID)
  }
};

export const getter = (idPath: string) => ({
  type: new GraphQLList(type),
  args: getterArgs,
  resolve: getterResolve(idPath)
});

export const setter = {
  type: type,
  args: setterArgs,
  resolve: setterResolve
};

export const deleter = {
  type: GraphQLInt,
  args: deleterArgs,
  resolve: deleterResolve
};
