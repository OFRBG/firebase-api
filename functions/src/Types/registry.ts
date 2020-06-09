import {get, mapValues} from 'lodash';

const registry = {};

const getPath = (path) => get({
  'setters': 'resolvers.setter',
  'getters': 'resolvers.getter',
  'models': 'model'
}, path, path);

export const register = ({name, data}) => registry[name] = data;

export const retrieveType = (name) => registry[name];

export const retrieve = (field) => mapValues(registry, (data) => {
  return get(data, getPath(field));
});
