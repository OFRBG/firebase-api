// @format
import { register } from "../registry";

import { readable } from "./fields";
import { model, schema } from "./type";
import { rootConnection, connection } from "./relay/connection";
import { setter, updater, getter, deleter } from "./resolvers";
import { collectionName } from "./resolvers/resolvers";

const name = "dishes";

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
    setter,
    updater
  }
});
