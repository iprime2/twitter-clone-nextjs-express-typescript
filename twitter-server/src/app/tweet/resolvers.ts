import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GraphqlContext } from "../../interfaces";
import { prismaClient } from "../clients/db";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UserService from "../../services/user";
import TweetService from "../../services/tweet";

interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}

const s3Client = new S3Client({
  region: process.env.AWS_S3_BUCKET,
});

const queries = {
  getAllTweets: () => {
    return TweetService.getAllTweets();
  },
  getSignedURLForTweet: async (
    parent: any,
    { imageType, imageName }: { imageType: string; imageName: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    const allowedImageTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedImageTypes.includes(imageType))
      throw new Error("Unsupported Image Type");

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      ContentType: imageType,
      Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}`,
    });

    const signedURL = await getSignedUrl(s3Client, putObjectCommand);

    return signedURL;
  },
};

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    try {
      if (!ctx.user) throw new Error("You are not authenticated");

      const tweet = await TweetService.createTweet(payload, ctx.user.id);
      return tweet;
    } catch (error) {
      console.log(error);
    }
  },
};

const extraResolvers = {
  Tweet: {
    author: (parent: any) => {
      return UserService.getUserById(parent.authorId);
    },
  },
};

export const resolvers = { mutations, extraResolvers, queries };
