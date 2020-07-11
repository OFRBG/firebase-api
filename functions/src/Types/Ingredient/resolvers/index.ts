// @format
import { GraphQLList, GraphQLID, GraphQLInt, GraphQLNonNull } from "graphql";

import { model as type } from "../type";
import { args as getterArgs } from "../fields";
import {
  IngredientInput as inputType,
  IngredientUpdateInput as updateType
} from "../inputTypes";

import { setIngredient as setterResolve } from "./resolvers";
import { updateIngredient as updaterResolve } from "./resolvers";
import { getIngredient as getterResolve } from "./resolvers";
import { removeIngredient as deleterResolve } from "./resolvers";

const setterArgs = {
  inputObject: {
    type: inputType
  }
};

const updaterArgs = {
  id: {
    type: GraphQLNonNull(GraphQLID)
  },
  inputObject: {
    type: updateType
  }
};

const deleterArgs = {
  ids: {
    type: GraphQLList(GraphQLNonNull(GraphQLID))
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

export const updater = {
  type: type,
  args: updaterArgs,
  resolve: updaterResolve
};

export const deleter = {
  type: GraphQLInt,
  args: deleterArgs,
  resolve: deleterResolve
};
