// @format
import { GraphQLList, GraphQLID, GraphQLInt } from "graphql";

import { model as type } from "../type";
import { args as getterArgs } from "../fields";
import { DishInput as inputType } from "../inputTypes";

import { setDish as setterResolve } from "./resolvers";
import { getDish as getterResolve } from "./resolvers";
import { removeDish as deleterResolve } from "./resolvers";

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
