import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    try {
      const googleToken = token;

      const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
      googleOauthURL.searchParams.set("id_token", googleToken);

      const { data } = await axios.get(googleOauthURL.toString(), {
        responseType: "json",
      });

      console.log(data);

      const user = await prismaClient.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        await prismaClient.user.create({
          data: {
            email: data.email,
            firstName: data.given_name,
            lastName: data.family_name,
            profileImageURL: data.picture,
          },
        });
      }

      const userInDb = await prismaClient.user.findUnique({
        where: { email: data.email },
      });

      if (!userInDb) throw new Error("User not found");

      const userToken = JWTService.generateToken(userInDb);
      console.log(userToken);

      return userToken;
    } catch (error) {
      console.log(error);
    }
  },
  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    try {
      const id = ctx.user?.id;

      if (!id) return null;
      const user = await prismaClient.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) return null;
      return user;
    } catch (error) {
      console.log(error);
    }
  },
};

const extraResolvers = {
  User: {
    tweets: (parent: User) => {
      return prismaClient.tweet.findMany({
        where: {
          authorId: parent.id,
        },
      });
    },
  },
};

export const resolvers = {
  queries,
  extraResolvers,
};
