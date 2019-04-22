// @format
import * as admin from 'firebase-admin';
import * as express from 'express';
import {authenticateUser} from './auth';

const app = express();

/**
 * Set a user as an admin
 *
 * @param {Object} currentUser User sending the request
 * @param {String} newAdminId
 */
const setAdminStatus = async (
  currentUser: {isAdmin?: string} | undefined,
  newAdminId: string,
  res: express.Response,
) => {
  if (currentUser && currentUser.isAdmin) {
    await admin.auth().setCustomUserClaims(newAdminId, {isAdmin: true});
    res.status(200).json(currentUser);
  } else {
    res.status(403).send();
  }
};

app.use(authenticateUser);

app.post('/newAdmin', async (req, res) => {
  console.log(app.locals.currentUser);
  await setAdminStatus(
    app.locals.currentUser,
    req.body.newAdminID,
    res,
  ).catch(e => {
    res.status(500).json(e);
  });
});

export const httpsHandlers = app;
