// @format
import {register} from '../registry';

import {readable} from './fields';
import {model} from './type';
import * as resolvers from './resolvers';

const name = 'dish';

register({name, data: {readable, resolvers, model}});
