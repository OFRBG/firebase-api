// @format
import * as admin from "firebase-admin";

/**
 * Add a new user to Firestore on creation
 *
 * @param {UserRecord} user New user registered via the API
 */
export const addNewUserToFirestore = async (user: admin.auth.UserRecord) => {
  await admin
    .firestore()
    .collection("users")
    .add({ uid: user.uid, email: user.email });
};
