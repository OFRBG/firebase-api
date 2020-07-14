// @format
import { connectionDefinitions, connectionArgs } from "graphql-relay";
import { merge } from "lodash";
import { model } from "../type";
import { args } from "../fields";
import { getIngredient as getter } from "../resolvers/resolvers";
import { buildRelayConnection } from "../../../utils";

const { connectionType } = connectionDefinitions({ nodeType: model });

export const connection = (path = "users") => ({
  type: connectionType,
  description: "Ingredient connection",
  args: merge({}, args, connectionArgs),
  resolve: async (root: any, args: any) => {
    const nodes = (await getter(path)(
      root,
      args,
      null
    )) as FirebaseFirestore.DocumentData[];

    return buildRelayConnection(nodes);
  }
});

export const rootConnection = connection();
