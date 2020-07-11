import { get, mapValues, mapKeys } from "lodash";

const registry: any = {};

/**
 * Get a property from a custom name request
 *
 * @param {String} path Name requested by retreive function
 */
const getPath = (path: string) =>
  get(
    {
      setters: "setter",
      models: "model",
      deleters: "deleter",
      updaters: "updater",
      root: "rootConnection"
    },
    path,
    path
  );

/**
 * For the requested value, map the key names to a new name
 *
 * @param {String} field Name requested by retreive function
 */
const getKeyMap = (field: string) =>
  get(
    {
      deleters: (value: any, key: string) => `${key}Deletion`,
      updaters: (value: any, key: string) => `${key}Updater`
    },
    field,
    (value: any, key: string) => key
  );

/**
 * Add a new object to the registry
 */
export const register = ({ name, data }: { name: string; data: any }) =>
  (registry[name] = data);

/**
 * Get an object from the registry by type name
 */
export const retrieveType = (name: string) => registry[name];

/**
 * Retrieve a key from all objects by requesting a field
 * and mapping the key names
 */
export const retrieve = (field: string) => {
  const requestedValues = mapValues(registry, data =>
    get(data, getPath(field))
  );

  const mappedKeys = mapKeys(requestedValues, getKeyMap(field));

  return mappedKeys;
};
