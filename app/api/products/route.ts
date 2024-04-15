import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// https verb is the name of the functions "POST".
export const POST = async () => {
  try {
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
