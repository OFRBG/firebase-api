// @format
import * as admin from 'firebase-admin';
import {Response, Request, NextFunction} from 'express';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get('Authorization');

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    const claims = await admin.auth().verifyIdToken(token);
    req.app.locals.currentUser = claims.uid;
  }

  next();
};
