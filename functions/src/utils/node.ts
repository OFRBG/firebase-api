import { nodeDefinitions } from "graphql-relay";
export const { nodeInterface } = nodeDefinitions(
  // @ts-ignore
  () => {
    /* Return local id */
  },
  // @ts-ignore
  () => () => {
    /* Return type */
  }
);
