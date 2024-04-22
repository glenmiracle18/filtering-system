import { db } from "@/lib/db";
import { productFilterValidator } from "@/validators/product-validators";
import { NextResponse } from "next/server";

// https verb is the name of the functions "POST".
export const POST = async (req: NextResponse) => {
  try {
    const body = await req.json();

    const { color, price, size, sort } = productFilterValidator.parse(body);

    const products = await db.product.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 15,
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log("error while fetching products", error);
  }
};
