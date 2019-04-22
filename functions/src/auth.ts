// @format
import * as admin from 'firebase-admin';
import {Response, Request, NextFunction} from 'express';

/**
 * Authenticate the user and set the id in app.locals
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get('Authorization');

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    try {
      const claims = await admin.auth().verifyIdToken(token);
      req.app.locals.currentUser = {
        uid: claims.uid || '',
        isAdmin: claims.isAdmin || false,
      };

      next();
    } catch (e) {
      res.status(400).json(e);
    }
  } else {
    next();
  }
};
