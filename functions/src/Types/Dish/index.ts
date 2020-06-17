// @format
import {register} from '../registry';

import {readable} from './fields';
import {model} from './type';
import {rootConnection, connection} from './relay/connection';
import * as resolvers from './resolvers';

const name = 'dishes';

register({name, data: {rootConnection, connection, readable, resolvers, model}});
