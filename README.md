#  Firebase GraphQL API

Libraries are great for integrations, but I personally believe that template generators create more mature systems that can be tailored for specific needs without being limited by black-boxing. This template generator can fire up an almost-no-config GraphQL on a Cloud Function with Firestore as data store.

## Prerequisites
In order to make this generator work, a few prerequisites need to be covered.

### Firebase Setup
0. Install Node 8 or use nvm
1. Install `firebase-tools`. Use `npm i -g firebase-tools@latest`.
2. Run `firebase login` and use the account linked to your Firebase project.
3. Clone the project
4. Run `firebase init`. Install Firestore, Functions, and Emulators.

> If you don't have a project yet, create a new Firebase project and set your region. You then need to activate Firestore.

## Generator
To generate a new type's boilerplate, run `npm run generate`, which will output the files to `src/Types`.

# Template Generator

## App
The main file contains the GraphQL API building. It imports the types built under `Types/` and exposes them through queries.
The `Query` type exposes resolvers linked to reading from the database. The `Mutation` type exposes the resolvers linked to the other operations.

 `index.ts`

```ts
import '../Types';
import {authenticateUser} from '../utils/auth';
import {retrieve} from '../Types/registry';

const app = express();

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: retrieve('root'),
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: retrieve('setters'),
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  types: values(retrieve('models')),
});
```

## Types

The structure for the API types is laid out as follows:

```
.
├── fields
│   └── index.ts
├── index.ts
├── inputTypes
│   └── index.ts
├── relay
│   ├── connection.ts
│   └── node.ts
├── resolvers
│   ├── index.ts
│   └── resolvers.ts
└── type
    ├── index.ts
    ├── model.ts
    └── schema.ts
```

<p align="center">
<img height="30" src="https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png"></img>
</p>

### `index.ts`
The index file of the type template registers several data points that can be accessed by the main application logic and by other types.

```ts
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
```

| Key | Data |
|--|--|
| collectionName | The Firestore collection's name |
| connection | The Relay Connection |
| model | The GraphQL Object |
| readable | The fields that the model exposes |
| rootConnection | The Relay Connection to use at root level |
| setter | The GraphQL input object description |

<p align="center">
<img height="30" src="https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png"></img>
</p>

### `fields/index.ts`

Objects correspond to the GraphQL fields that can be either read, written, or filtered. These are exported as `readable`, `writable`, and `args`. Writtable are the fields that are set via mutation. Readable are the fields that can be queries via query. Args are a subset of `readable` used as arguments for queries.

<p align="center">
<img height="30" src="https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png"></img>
</p>

### `resolvers`
#### `index.ts`

The index contains the exported object supplied to the top-level query. The export needs `{type, args, resolve}` to build the mutation.

#### `resolvers.ts`
Resolvers contain the logic to proxy the database. They take the GraphQL resolver params `[root, args, context]` and return the type specified by `type` of the exported object in `index`.

```ts
export const getA = async (root: any, args: any, context: any): Promise<Item> =>
  fetchFromDB( ... );
```

#### `inputType/index`
Input types represent objects that can be passed into queries. Using Input Types makes validation much simpler and reduces scope.
If the input will be used for a writing mutation, we need to retrieve the `setters`.

```ts
import {GraphQLInputObjectType} from 'graphql';

import {writable} from '../fields';

export const TypeInput = new GraphQLInputObjectType({
  name: 'AInput',
  description: 'A mutation input',
  fields: () => writable,
});
```

<p align="center">
<img height="30" src="https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png"></img>
</p>

### `type/`
The type represents the GraphQL and internal shape of the object.

#### `model.ts`
The model exports the GraphQL Type of the type we are representing. We need to supply a name and its fields. We want to expose
the readable fields, so we import the `getters` for our model.

```ts
import {GraphQLObjectType} from 'graphql';

import {readable} from '../fields';

export const model = new GraphQLObjectType({
  name: 'A data type',
  fields: () => readable,
});
```

#### `schema.ts`
It is useful to have a secondary schema validation library to guard Firestore uploads. The template includes a generic schema generator from the field structure, but it is possible to write your own schema instead. The schema runs before uploading using the included Firestore utils.

```ts
import * as yup from 'yup';
import {writable} from '../fields';
import {fieldsToYup} from '../../../utils/schema';

const generatedFields = fieldsToYup(writable);

const overrideFields = {};

/**
 * Create a yup validation schema to use
 * before inserting to the database
 */
export const schema = yup.object()
  .shape(generatedFields)
  .shape(overrideFields)
  .noUnknown();

```
