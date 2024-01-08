import { prismaClient } from "../app/clients/db";

interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}

class TweetService {
  public static async createTweet(payload: CreateTweetPayload, userId: string) {
    return await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public static async getAllTweets() {
    return prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } });
  }
}

export default TweetService;
