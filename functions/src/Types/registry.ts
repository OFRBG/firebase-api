import { get, mapValues, mapKeys } from "lodash";

const registry: any = {};

const getPath = (path: string) =>
  get(
    {
      setters: "setter",
      models: "model",
      deleters: "deleter",
      root: "rootConnection"
    },
    path,
    path
  );

const getKeyMap = (field: string) =>
  get(
    {
      deleters: (value: any, key: string) => `${key}Deletion`
    },
    field,
    (value: any, key: string) => key
  );

export const register = ({ name, data }: { name: string; data: any }) =>
  (registry[name] = data);

export const retrieveType = (name: string) => registry[name];

export const retrieve = (field: string) => {
  const requestedValues = mapValues(registry, data =>
    get(data, getPath(field))
  );

  const mappedKeys = mapKeys(requestedValues, getKeyMap(field));

  return mappedKeys;
};
