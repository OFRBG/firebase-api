// @format
import * as admin from 'firebase-admin';
import * as express from 'express';
import {Response} from 'express';
import {authenticateUser} from './auth';

const app = express();

app.use(authenticateUser);

app.post('/newAdmin', (req, res) => {
  console.log(app.locals.currentUser);
  setAdminStatus(app.locals.currentUser, req.body.newAdminID, res);
});

/**
 * Set a user as an admin
 *
 * @param {Object} currentUser User sending the request
 * @param {String} newAdminId
 */
const setAdminStatus = (
  currentUser: {isAdmin?: string} | undefined,
  newAdminId: string,
  res: Response,
) => {
  if (currentUser && currentUser.isAdmin) {
    admin.auth().setCustomUserClaims(newAdminId, {isAdmin: true});

    res.status(200).json(currentUser);
  } else {
    res.status(403).send();
  }
};

export const httpsHandlers = app;
