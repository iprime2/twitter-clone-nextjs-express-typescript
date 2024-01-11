import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphClient = new GraphQLClient(
  "https://twitter-clone-server-fhuv.onrender.com/graphql",
  {
    headers: {
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("__twitter_clone_token")}`
        : "",
    },
  }
);
