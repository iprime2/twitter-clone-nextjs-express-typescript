import { graphClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweet";

export const getAllTweets = async () => {
  const allTweets = await graphClient.request(getAllTweetsQuery);

  console.log("allTweets", allTweets);
  return allTweets;
};
