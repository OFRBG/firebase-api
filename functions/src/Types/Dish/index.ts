// @format
import {register} from '../registry';

import {readable} from './fields';
import {model} from './type';
import {rootConnection, connection} from './relay/connection';
import {setter} from './resolvers';
import {collectionName} from './resolvers/resolvers';

const name = 'dishes';

register({
  name,
  data: {
    collectionName,
    connection,
    model,
    readable,
    rootConnection, 
    setter,
  }
});
