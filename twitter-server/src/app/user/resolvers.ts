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
    tweets: (parent: User) =>
      prismaClient.tweet.findMany({
        where: {
          authorId: parent.id,
        },
      }),
    followers: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: { following: { id: parent.id } },
        include: {
          follower: true,
        },
      });
      return result.map((el) => el.follower);
    },
    following: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: { follower: { id: parent.id } },
        include: {
          following: true,
        },
      });
      return result.map((el) => el.following);
    },
  },
};

const mutations = {
  followUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");

    await UserService.followUser(ctx.user.id, to);
    // await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
    return true;
  },
  unfollowUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");
    await UserService.unfollowUser(ctx.user.id, to);
    // await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
    return true;
  },
};

export const resolvers = {
  queries,
  extraResolvers,
  mutations,
};
