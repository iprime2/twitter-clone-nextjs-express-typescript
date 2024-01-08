import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const userToken = await UserService.verifyGoogleToken(token);
    return userToken;
  },
  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    try {
      const id = ctx.user?.id;

      if (!id) return null;
      const user = await UserService.getUserById(id);
      return user;
    } catch (error) {
      console.log(error);
    }
  },
  getUserById: async (
    parent: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => {
    return UserService.getUserById(id);
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
