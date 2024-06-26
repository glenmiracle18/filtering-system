import { db } from "@/lib/db";
import { productFilterValidator } from "@/validators/product-validators";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { color, price, size, sort } = productFilterValidator.parse(
      body.filter,
    );

    const orderByOptions: Record<string, { [key: string]: string }> = {
      asc: { price: "asc" },
      desc: { price: "desc" },
    };

    const orderBy = orderByOptions[sort] || { createdAt: "asc" }; // ignore the typescrip error

    const products = await db.product.findMany({
      where: {
        color: { in: color },
        size: { in: size },
        price: { gte: price[0], lte: price[1] },
      },
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("error while fetching products", error);
  }
};
