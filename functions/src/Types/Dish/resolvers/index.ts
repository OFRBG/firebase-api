// @format
import { GraphQLList, GraphQLID, GraphQLInt, GraphQLNonNull } from "graphql";

import { model as type } from "../type";
import { args as getterArgs } from "../fields";
import {
  DishInput as inputType,
  DishUpdateInput as updateType
} from "../inputTypes";

import { setDish as setterResolve } from "./resolvers";
import { updateDish as updaterResolve } from "./resolvers";
import { getDish as getterResolve } from "./resolvers";
import { removeDish as deleterResolve } from "./resolvers";

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
