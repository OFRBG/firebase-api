# 🔥 firebase-api 🔥

---

PoC GCP GraphQL API

---

## Types

The structure for the API types is laid out as follows:

```
.
├── fields
│   └── index.ts
├── index.ts
├── resolvers
│   ├── index.ts
│   ├── inputTypes
│   │   └── index.ts
│   └── resolvers.ts
└── type
    ├── index.ts
    ├── model.ts
    └── schema.ts
```

### `index.ts`
The index file of the model exports the fields, the resolvers, and the GraphQL representation of the type. This information
is used in the main GraphQL app.

```ts
import {getters as fields} from './fields';
import {model} from './type';
import * as resolvers from './resolvers';

export const A = {fields, resolvers, model};
```

---

### `fields/index.ts`

Fields represent the API structure of a type. Every type has a `setter` export and a `getter` export.
Setter exports are used for resolvers that write, and getter exports are used for resolvers that read.

e.g. When fetching a nested field we need to recursively call getter resolvers. When adding a new object,
we only need to provide a list of linked objects. In this case, `A` references a list of ids of `B`.

```ts
import {GraphQLString, GraphQLList} from 'graphql';

import {B} from '../../../Types';

const prop1 = {
  type: GraphQLString,
};

const prop2 = {
  setter: {
    type: GraphQLList(GraphQLString),
  },
  getter: B.resolvers.getB,
};

export const setters = {
  prop1: prop1,
  prop2: prop2.setter
};

export const getters = {
  prop1: prop1,
  prop2: prop2.getter
};

```

---

### `resolvers/`
#### `index.ts`

The index contains the exported objects supplied to the top-level query. These object need `[type, args, resolve]` to be valid fields.

```ts
import {GraphQLList} from 'graphql';
import {pick} from 'lodash';

import {getters as fields} from '../fields';
import {model} from '../type';

import * as resolvers from './resolvers';
import * as inputTypes from './inputTypes';

export const getA = {
  type: new GraphQLList(model),
  args: pick(fields, ['prop1', 'prop2']),
  resolve: resolvers.getA,
};

export const setA = {
  type: model,
  args: {
    input: {
      type: inputTypes.SetAInput,
    },
  },
  resolve: resolvers.setA,
};
```

#### `resolvers.ts`
Resolvers contain the logic to proxy the database. They take the GraphQL resolver params `[root, args, context]`
and return the type specified by `type` of the exported object in `index`.

```ts
export const getA = async (root: Object, args: any, context: any) =>
  fetchFromDB( ... );
```

#### `inputType/index`
Input types represent objects that can be passed into queries. Using Input Types makes validation much simpler and reduces scope.
If the input will be used for a writing mutation, we need to retrieve the `setters`.

```ts
import {GraphQLInputObjectType} from 'graphql';
import {pick} from 'lodash';

import {setters as fields} from '../../fields';

export const SetAInput = new GraphQLInputObjectType({
  name: 'SetAInput',
  description: 'setA mutation input',
  fields: () => pick(fields, ['prop1', 'prop2']),
});
```

---

### `type`
The type represents the GraphQL and internal shape of the object.

#### `model.ts`
The model exports the GraphQL Type of the type we are representing. We need to supply a name and its fields. We want to expose
the readable fields, so we import the `getters` for our model.

```ts
import {GraphQLObjectType} from 'graphql';

import {getters as fields} from '../fields';

export const model = new GraphQLObjectType({
  name: 'A',
  fields: () => fields,
});
```

#### `schema.ts`
It is useful to have a secondary schema validation library.
It is particularly helpful when running mutations to validate the shape of the inputs.

```ts
import * as yup from 'yup'; /* Simple ORM https://github.com/jquense/yup */

export const schema = yup.object().shape({
  prop1: yup.string().required(),
  prop2: yup
    .array()
    .of(yup.string()),
});
```
