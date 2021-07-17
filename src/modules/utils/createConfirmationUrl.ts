import { v4 } from "uuid";
import { redis } from "../../redis";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4() // just a unique id for the conf email
  await redis.set(token, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `http://localhost:3000/user/confirm/${token}`;
};