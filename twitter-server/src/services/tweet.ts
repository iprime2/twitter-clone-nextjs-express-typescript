import { prismaClient } from "../app/clients/db";
import { redisClient } from "../app/redis";

interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}

class TweetService {
  public static async createTweet(payload: CreateTweetPayload, userId: string) {
    const rateLimitFLag = await redisClient.get(`RATE_LIMIT_TWEET:${userId}`);

    if (rateLimitFLag) throw new Error("Rate Limit Exceeded!");
    const tweet = await prismaClient.tweet.create({
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
    await redisClient.setex(`RATE_LIMIT_TWEET:${userId}`, 10, 1);
    await redisClient.del("ALL_TWEETS");

    return tweet;
  }

  public static async getAllTweets() {
    const cachedTweets = await redisClient.get("ALL_TWEETS");
    // const tweetCount = await prismaClient.tweet.count();

    // if (cachedTweets?.length ?? 0 < tweetCount) {
    //   const tweets = await prismaClient.tweet.findMany({
    //     orderBy: { createdAt: "desc" },
    //   });
    //   await redisClient.set("ALL_TWEETS", JSON.stringify(tweets));
    //   return tweets;
    // }

    if (cachedTweets) {
      return JSON.parse(cachedTweets);
    }
    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
    await redisClient.set("ALL_TWEETS", JSON.stringify(tweets));
    return tweets;
  }
}

export default TweetService;
