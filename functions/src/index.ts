// @format
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {api} from './graphql.app';
import {httpsHandlers} from './httpsHandlers.app';
import {addNewUserToFirestore} from './userHandlers';

admin.initializeApp();

export const graphql = functions.https.onRequest(api);
export const handlers = functions.https.onRequest(httpsHandlers);
export const registerUser = functions.auth
  .user()
  .onCreate(addNewUserToFirestore);
