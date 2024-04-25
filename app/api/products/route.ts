import { db } from "@/lib/db";
import {
  ProductState,
  productFilterValidator,
} from "@/validators/product-validators";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

// filter assertation logic
class Filter {
  // the first string is for the size and the second string if for the price range
  private filters: Map<string, string[]> = new Map();

  // checks if the the filters mapped array is populated
  hasFilter() {
    return this.filters.size > 0; // the size here is the number of elements in the map
  }

  // The add method is used to add a new filter condition to the filters map.
  add(key: string, operator: string, value: string | number) {
    const filter = this.filters.get(key) || []; // collect the keys from the filtes map key/ value pair
    filter.push(
      `${key} ${operator} ${typeof value === "number" ? value : `"${value}"`}`, // if the value is a number, insert just the number, else (string) wrap it with string quotes
    );
    this.filters.set(key, filter);
  }

  // The addRaw method allows adding a raw filter condition directly to the filters map without constructing it.
  addRaw(key: string, rawFilter: string) {
    this.filters.set(key, [rawFilter]);
  }

  // The get method constructs and returns the final filter string to be used in a database query.
  get() {
    const parts: string[] = [];
    this.filters.forEach((filter) => {
      const groupedValues = filter.join(` OR `);
      parts.push(`(${groupedValues})`);
    });
    return parts.join(" AND ");
  }
}

// constants
const AVG_PRODUCT_PRICE = 25 as const;
const MAX_PRODUCT_PRICE = 50 as const;
// https verb is the name of the functions "POST".
export const POST = async (req: NextResponse) => {
  try {
    const body = await req.json();

    const { color, price, size, sort } = productFilterValidator.parse(
      body.filter,
    );

    const filter = new Filter();

    color.forEach((color) => filter.add("color", "=", color));
    size.forEach((size) => filter.add("size", "=", size));
    filter.addRaw("price", `price >= ${price[0]} AND price <= ${price[1]}`);

    // Construct the filter string
    const filterString = filter.hasFilter() ? filter.get() : "";

    const products = await db.product.findMany({
      where: filterString ? { [filterString]: {} } : {},
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
