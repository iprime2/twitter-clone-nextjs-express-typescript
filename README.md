# Twitter Clone

https://sushil-twitter-clone-client.vercel.app

This project is a full-stack web application built using Node.js and Next.js. It utilizes a GraphQL server running in a Node.js environment for the backend, with Prisma ORM for interacting with a PostgreSQL database. The database is hosted and managed using Supabase, a cloud PostgreSQL service. Redis is used for query caching on the server side, which helps to increase query speeds.

The project also incorporates various authentication and authorization features. Google OAuth is used for Sign in with Google functionality, and JSON Web Tokens (JWT) are used for authentication.

One of the key features of this project is user recommendation. The application recommends friends based on the user's followers. It analyzes the user's follower list and suggests potential friends who have a similar interest or connection.

On the frontend, Next.js is used as the framework for building React applications. It provides server-side rendering and optimized performance. TailwindCSS is used for styling and creating reusable components. Typescript is used throughout the project to maintain code quality and write type-safe code.

The project makes use of several additional tools and technologies. Codegen is used for generating typesafe GraphQL queries and mutations. Graphql-Request is used as the API client for client-server communication. React-Query is used for client-side data caching and query caching. Amazon Web Services (AWS) is used for storage, deployments, and CDN (Content Delivery Network).

## DEMO

https://github.com/iprime2/twitter-clone-nextjs-express-typescript/assets/29702609/dcda3725-721d-40ef-be3c-6b6913a64d3e

## Tech Stack
#### Backend:
  - Node.js
  - GraphQL
  - Prisma ORM
  - PostgreSQL
  - Supabase
  - Redis
  - Google OAuth
  - JSON Web Tokens (JWT)
#### Frontend:
  - Next.js
  - TailwindCSS
  - Typescript
  - Codegen
  - Graphql-Request
  - React-Query
#### Additional:
  - Amazon Web Services (AWS)

## Installation

To run the project locally, follow these steps:

1. Clone the repository.
2. set up .env
    1. Inside twitter-client folder create .env with following variable
       ```
       GOOOGLE_CLIENT_ID=
       GOOGLE_SECRET=
       GRAPH_URL=
       ```
    2. Inside twitter-server folder create .env with following variable
       ```
        DATABASE_URL=
        AWS_ACCESS_KEY_ID=
        AWS_SECRET_ACCESS_KEY=
        AWS_DEFAULT_REGION=
        AWS_S3_BUCKET=
        REDIS_URL=
        PORT=4000
       ```
3. Run below command to start server.
    ```
    cd twitter-server
    pnpm i
    pnpm run dev
    ```
    The server will start on port `localhost:4000` 

4. Run below command to start server.
    ```
    cd twitter-client
    pnpm i
    pnpm run dev
    ```
    The forntend will start and access it using `localhost:3000` 
