import * as yup from 'yup';
import {mapValues, get} from 'lodash';

type Field = {
  collection: string;
  type: any;
  name: string;
}

const appId = (collection: Field['collection']) =>
  new RegExp(`^app:${collection}:[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$`, 'i');

const fieldTypeToYup = (field: Field) => {
  const [fullMatch, baseType] = field.type
    .toString()
    .match(/\[?(\w+)\]?/);
  
  const isArray = get(fullMatch, '[0]') === '[';

  let schemaField = get({
    'String': () => yup.string(),
    'Boolean': () => yup.boolean(),
    'ID': () => yup.string()
    .matches(
      appId(field.collection),
      ({path}) => `${path} needs to be formatted as app:${field.collection}:{uuid}`
    ),
  }, baseType, yup.mixed);

  schemaField = isArray
    ? yup.array(schemaField())
    : schemaField();

  return schemaField.required();
}

export const fieldsToYup = (fields: {[key: string]: Field}) => mapValues(fields, fieldTypeToYup)
