import { PrismaClient, Product } from "@prisma/client";
import * as dotenv from "dotenv";

const database = new PrismaClient();

dotenv.config();

const getRandomPrice = () => {
  const PRICES = [9.99, 19.99, 29.99, 39.99, 49.99];
  return PRICES[Math.floor(Math.random() * PRICES.length)];
};

const COLORS = ["white", "beige", "blue", "green", "purple"] as const;
const SIZES = ["S", "M", "L"] as const;

const seed = async () => {
  try {
    const products: Product[] = [];

    // 3 example products
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < COLORS.length; j++) {
        for (let k = 0; k < SIZES.length; k++) {
          const size = SIZES[k];
          const color = COLORS[j];
          const currentDate = new Date(); // date object for createdAt and updatedAt
          products.push({
            id: `${color}-${size}-${i + 1}`,
            imageId: `/${color}_${i + 1}.png`,
            color,
            name: `${
              color.slice(0, 1).toUpperCase() + color.slice(1)
            } shirt ${i}`,
            size,
            price: getRandomPrice(),
            createdAt: currentDate,
            updatedAt: currentDate,
          });
        }
      }
    }

    const SIZE_MAP = {
      S: 0,
      M: 1,
      L: 2,
    };

    const COLOR_MAP = {
      white: 0,
      beige: 1,
      blue: 2,
      green: 3,
      purple: 4,
    };

    // main seed block
    for (const product of products) {
      await database.product.upsert({
        where: { id: product.id },
        create: {
          id: product.id,
          name: product.name,
          imageId: product.imageId,
          price: product.price,
          color: product.color,
          size: product.size,
        },
        update: {},
      });
    }

    console.log("Successfull seeding");
  } catch (error) {
    console.log(error);
  } finally {
    database.$disconnect();
  }
};

seed();
