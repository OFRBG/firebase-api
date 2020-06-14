import {nodeDefinitions, fromGlobalId} from 'graphql-relay';

import {model} from '../type';
import {getIngredientWithId} from '../resolvers/resolvers';

export default nodeDefinitions(
  globalId => {
    const {id} = fromGlobalId(globalId);

    return getIngredientWithId(id)
  },
  (): any => model
);
