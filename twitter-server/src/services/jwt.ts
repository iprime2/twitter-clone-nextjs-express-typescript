import { User } from "@prisma/client";
import { prismaClient } from "../app/clients/db";
import JWT from "jsonwebtoken";

const JWT_SECRET = "$secret-sushil";

class JWTService {
  public static generateToken(user: User) {
    const payload = {
      id: user?.id,
      email: user?.email,
    };
    const token = JWT.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  }
}

export default JWTService;
