// @format
import { GraphQLList } from "graphql";

import { model as type } from "../type";
import { args as getterArgs } from "../fields";
import { IngredientInput as inputType } from "../inputTypes";

import { setIngredient as setterResolve } from "./resolvers";
import { getIngredient as getterResolve } from "./resolvers";

const setterArgs = {
  inputObject: {
    type: inputType
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
