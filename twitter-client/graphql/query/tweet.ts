import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
  #graphql

  query GetAllTweets {
    getAllTweets {
      content
      id
      author {
        id
        email
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);

export const getSignedURLForTweetQuery = graphql(`
  query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
  }
`);
