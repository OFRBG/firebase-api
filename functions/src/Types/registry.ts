import {get, mapValues} from 'lodash';

const registry: any = {};

const getPath = (path: string) => get({
  'setters': 'setter',
  'models': 'model',
  'root': 'rootConnection',
}, path, path);

export const register = ({name, data}: {name: string, data: any}) => registry[name] = data;

export const retrieveType = (name: string) => registry[name];

export const retrieve = (field: string) => mapValues(registry, (data) => {
  return get(data, getPath(field));
});
