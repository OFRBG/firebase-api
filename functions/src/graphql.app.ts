// @format
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import {GraphQLSchema, GraphQLObjectType} from 'graphql';
import {Course} from './Course';
import {authenticateUser} from './auth';

const app = express();

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    course: Course.resolvers.getCourses,
  }),
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    setCourse: Course.resolvers.setCourse,
    deleteCourse: Course.resolvers.deleteCourse,
  }),
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  types: [Course.type],
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