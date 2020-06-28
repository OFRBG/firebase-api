// @format
import * as yup from "yup";
import { writable } from "../fields";
import { fieldsToYup } from "../../../utils/schema";

/**
 * Create a yup validation schema to use
 * before inserting to the database
 */
export const schema = () => {
  // @ts-ignore
  const generatedFields = fieldsToYup(writable);

  const overrideFields = {};

  return yup
    .object()
    .shape(generatedFields)
    .shape(overrideFields)
    .noUnknown();
};
