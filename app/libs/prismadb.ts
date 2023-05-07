import { PrismaClient } from "@prisma/client";

// 这样应该是让所有的 global都能进入 client 这个值
declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
