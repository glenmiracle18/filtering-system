import { db } from "@/lib/db";

// https verb is the name of the functions "POST".
export const POST = async () => {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 15,
    });
    return new Response(JSON.stringify(products));
  } catch (error) {
    console.log("fetching products", error);
  }
};
