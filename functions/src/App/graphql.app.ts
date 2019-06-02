// @format
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import {GraphQLSchema, GraphQLObjectType} from 'graphql';

import {Dish, Ingredient} from '../Types';
import {authenticateUser} from '../utils/auth';

const app = express();

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    dish: Dish.resolvers.getDish,
    ingredient: Ingredient.resolvers.getIngredient,
  }),
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    setIngredient: Ingredient.resolvers.setIngredient,
  }),
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

app.use(
  authenticateUser,
  graphqlHTTP(req => {
    return {
      schema: schema,
      context: {
        currentUser: req.app.locals.currentUser,
      },
      graphiql: true,
    };
  }),
);

export const api = app;
