import { PrismaClient } from "@prisma/client";

export type ProductTypes = {
  id: string;
  imageId: string;
  name: string;
  size: "S" | "M" | "L";
  color: "white" | "beige" | "blue" | "green" | "purple";
  price: number;
};

declare global {
  var prisma: PrismaClient | undefined;
}
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
