import { z } from "zod";
const AVAILABLE_SIZES = ["S", "M", "L"] as const;
const AVAILABLE_COLORS = ["blue", "white", "green", "biege", "purple"] as const;
const AVAILABLE_SORT = ["none", "price-asc", "price_desc"] as const;

// using zod to validate the product filter types for safety
export const productFilterValidator = z.object({
  size: z.array(z.enum(AVAILABLE_SIZES)), // an array of enumerable of the available sizes
  color: z.array(z.enum(AVAILABLE_COLORS)),
  sort: z.enum(AVAILABLE_SORT), // not an array bcs just one sort option can be selected at once
  price: z.tuple([z.number(), z.number()]),
});

export type ProductState = Omit<
  z.infer<typeof productFilterValidator>,"price"> & {
  price: { isCustom: boolean; range: [number, number] };
};
