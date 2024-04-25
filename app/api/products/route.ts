import { db } from "@/lib/db";
import { productFilterValidator } from "@/validators/product-validators";
import { NextResponse } from "next/server";

export const POST = async (req: NextResponse) => {
  try {
    const body = await req.json();

    const { color, price, size, sort } = productFilterValidator.parse(
      body.filter,
    );

    const products = await db.product.findMany({
      where: {
        color: { in: color },
        size: { in: size },
        price: { gte: price[0], lte: price[1] },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("error while fetching products", error);
  }
};
