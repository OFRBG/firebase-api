// @format
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {api} from './App/graphql.app';
import {httpsHandlers} from './App/httpsHandlers.app';
import {addNewUserToFirestore} from './Event/userHandlers';

admin.initializeApp();

const functionWithSettings = functions.runWith({
  timeoutSeconds: 2,
  memory: '128MB',
});

export const graphql = functionWithSettings.https.onRequest(api);
export const handlers = functionWithSettings.https.onRequest(httpsHandlers);
export const registerUser = functionWithSettings.auth
  .user()
  .onCreate(addNewUserToFirestore);
