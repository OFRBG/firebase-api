// @format
import * as yup from "yup";
import { mapValues, isFunction, get } from "lodash";

type Field = {
  collection: string;
  type: any;
  name: string;
};

type ExportField = () => Field | Field;

const appId = (collection: Field["collection"]) =>
  new RegExp(
    `^app:${collection}:[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$`,
    "i"
  );

export const fieldGenerator = (collection: string) => ({
  String: () => yup.string(),
  Boolean: () => yup.boolean(),
  ID: () =>
    yup
      .string()
      .matches(
        appId(collection),
        ({ path }) =>
          `${path} needs to be formatted as app:${collection}:{uuid}`
      )
});

const fieldTypeToYup = (field: Field) => {
  const [fullMatch, baseType] = field.type.toString().match(/\[?(\w+)\]?/);

  const isArray = get(fullMatch, "[0]") === "[";

  let schemaField = get(fieldGenerator(field.collection), baseType, yup.mixed);

  schemaField = isArray ? yup.array(schemaField()) : schemaField();

  return schemaField.when("$isUpdate", {
    is: true,
    then: schemaField.notRequired(),
    otherwise: schemaField.required()
  });
};

export const fieldsToYup = (fields: { [key: string]: ExportField }) =>
  mapValues(fields, field =>
    fieldTypeToYup(isFunction(field) ? field() : field)
  );
