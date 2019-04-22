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

const setAdminStatus = (
  currentUser: {uid?: string, isAdmin?: string},
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
