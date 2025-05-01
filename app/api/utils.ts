import { PrismaClient, Prisma } from "../../generated/prisma";

const prisma = new PrismaClient();

export const removeTokens = async () => {
  try {
    return prisma.refreshToken.delete({ where: { source: "google" } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      // do nothing, it's ok if we try to remove something that doesn't exist.
    } else {
      throw e;
    }
  }
};
