// @format
import { connectionDefinitions, connectionArgs } from "graphql-relay";
import { merge } from "lodash";
import { model } from "../type";
import { args } from "../fields";
import { getDish as getter } from "../resolvers/resolvers";
import { buildRelayConnection } from "../../../utils";

const { connectionType } = connectionDefinitions({ nodeType: model });

export const connection = (path = "users") => ({
  type: connectionType,
  description: "Dish connection",
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
