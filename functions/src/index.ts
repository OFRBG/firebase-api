// @format
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import {GraphQLSchema, GraphQLObjectType} from 'graphql';
import {Course} from './Course';

admin.initializeApp();

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
    addCourse: Course.resolvers.addCourse,
    deleteCourse: Course.resolvers.deleteCourse,
  }),
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  types: [Course.type],
});

app.use(
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);

export const graphql = functions.https.onRequest(app);
