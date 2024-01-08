export const types = `#graphql
    
    type User {
        id: ID!
        name: String!
        firstName: String!
        lastName: String!
        email: String!
        profileImageURL: String

        followers: [User]
        following: [User]
        
        tweets: [Tweet]
    }
    
`;
