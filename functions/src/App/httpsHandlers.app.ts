// @format
import * as admin from "firebase-admin";
import * as express from "express";
import { authenticateUser } from "../utils/auth";

const app = express();

/**
 * Set a user as an admin
 *
 * @param {Object} currentUser User sending the request
 * @param {String} newAdminId
 */
const setAdminStatus = async (
  currentUser: { isAdmin?: string; isOwner?: string } | undefined,
  newUserRoles: {
    id: string;
    roles: { isAdmin?: boolean; isMaster?: boolean };
  },
  res: express.Response
) => {
  if (currentUser && currentUser.isOwner) {
    await admin.auth().setCustomUserClaims(newUserRoles.id, newUserRoles.roles);
    await admin
      .firestore()
      .collection("users")
      .doc(newUserRoles.id)
      .set(newUserRoles.roles);

    res.status(200).json(newUserRoles);
  } else {
    res.status(401).send();
  }
};

/**
 * Set the app owner as the seed authority
 *
 * @param {Object} currentUser User sending the request
 */
const setOwnerStatus = async (ownerId: string, res: express.Response) => {
  await admin.auth().setCustomUserClaims(ownerId, { isOwner: true });
  res.status(200).send();
};

app.use(authenticateUser);

app.post("/init", async (req, res) => {
  await setOwnerStatus("jRiKVS27LqcpZZPTSTR3FD40m7f2", res).catch(e => {
    res.status(500).json(e);
  });
});

app.post("/setRoles", async (req, res) => {
  const newUserRoles = {
    id: req.body.id,
    roles: {
      isAdmin: req.body.setAdmin === "1",
      isMaster: req.body.setMaster === "1"
    }
  };

  await setAdminStatus(app.locals.currentUser, newUserRoles, res).catch(e => {
    res.status(500).json(e);
  });
});

export const httpsHandlers = app;
