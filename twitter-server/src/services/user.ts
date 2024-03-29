import axios from "axios";
import { prismaClient } from "../app/clients/db";
import JWTService from "./jwt";

class UserService {
  public static async verifyGoogleToken(token: string) {
    try {
      const googleToken = token;

      const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
      googleOauthURL.searchParams.set("id_token", googleToken);

      const { data } = await axios.get(googleOauthURL.toString(), {
        responseType: "json",
      });

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
  }

  public static async getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  public static followUser(from: string, to: string) {
    return prismaClient.follows.create({
      data: {
        follower: { connect: { id: from } },
        following: { connect: { id: to } },
      },
    });
  }

  public static unfollowUser(from: string, to: string) {
    return prismaClient.follows.delete({
      where: { followerId_followingId: { followerId: from, followingId: to } },
    });
  }
}

export default UserService;
