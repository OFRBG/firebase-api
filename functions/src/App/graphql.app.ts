// @format
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { values } from "lodash";

import "../Types";
import { authenticateUser } from "../utils/auth";
import { retrieve } from "../Types/registry";

const app = express();

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: retrieve("root")
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: retrieve("setters")
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  types: values(retrieve("models"))
});

app.use(
  authenticateUser,
  graphqlHTTP(req => {
    return {
      schema: schema,
      context: {
        currentUser: req.app.locals.currentUser
      },
      graphiql: true
    };
  })
);

export const api = app;
