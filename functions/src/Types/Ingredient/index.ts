// @format
import { register } from "../registry";

import { readable } from "./fields";
import { model, schema } from "./type";
import { rootConnection, connection } from "./relay/connection";
import { setter, getter, deleter } from "./resolvers";
import { collectionName } from "./resolvers/resolvers";

const name = "ingredients";

register({
  name,
  data: {
    collectionName,
    connection,
    deleter,
    getter,
    model,
    readable,
    rootConnection,
    schema,
    setter
  }
});
