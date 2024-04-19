"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { ProductTypes } from "@/lib/types";
import Product from "@/components/Products/product";
import ProductSkeleton from "@/components/Products/product-skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductState } from "@/validators/product-validators";

export default function Home() {
  const SORT_OPTIONS = [
    { name: "None", value: "none" },
    { name: "Price", value: "asc" },
    { name: "Price", value: "desc" },
  ] as const;
  // declaring it "as conts" will make it a constant and also prevent pushing into the array, like SORT_OPTIONS.PUSH({name: "new", value: "value"}

  const SUB_CATEGORIES = [
    { name: "T-shirts", selected: true, href: "#" },
    { name: "Pants", selected: false, href: "#" },
    { name: "Hoodies", selected: false, href: "#" },
    { name: "Accesories", selected: false, href: "#" },
  ] as const;

  const SIZE_FILTER = {
    id: "size",
    name: "Size",
    options: [
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
    ],
  } as const;

  const COLOR_FILTER = {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "biege", label: "Biege" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
    ],
  } as const;

  const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];

  // state management for sorting, infered from productstate validated with zod
  const [filter, setFilter] = useState<ProductState>({
    sort: "none",
    color: ["white", "biege", "blue", "green", "purple"],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ["S", "L", "M"],
  });

  console.log(filter);

  // quick data fetch demo
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<ProductTypes[]>(
        "http://localhost:3000/api/products",
        {
          filter: {
            sort: filter.sort,
          },
        },
      );
      return data;
    },
  });

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    // checks if the category in in the filter array
    const isFilterApplied = filter[category].includes(value as never);

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High-quality cotton selection
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem key={option.value}>
                  <button
                    className={cn("w-full px-4 py-2 text-left text-sm", {
                      "bg-gray-100 text-gray-900": option.value === filter.sort,
                      "text-gray-500": option.value !== filter.sort,
                    })}
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        sort: option.value,
                      }))
                    }
                  >
                    {option.name}: {option.value}
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="pt-10 pb-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* filter grid */}
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUB_CATEGORIES.map((category) => (
                <li key={category.name}>
                  <button
                    disabled={!category.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* accordion  */}
            <Accordion type="multiple" className="animate-none">
              {/* color filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="font-medium text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Color</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 animate-none">
                  <ul className="space-y-4">
                    {COLOR_FILTER.options.map((option, idx) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          onChange={() => {
                            applyArrayFilter({
                              category: "color",
                              value: option.value,
                            });
                          }}
                          checked={filter.color.includes(option.value)}
                          id={`color-${idx}`}
                          className=" h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`color-${idx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* size filter */}
            <Accordion type="multiple" className="animate-none">
              <AccordionItem value="size">
                <AccordionTrigger className="font-medium text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Size</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 animate-none">
                  <ul className="space-y-4">
                    {SIZE_FILTER.options.map((option, idx) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          onChange={() => {
                            applyArrayFilter({
                              category: "size",
                              value: option.value,
                            });
                          }}
                          checked={filter.size.includes(option.value)}
                          id={`size-${idx}`}
                          className=" h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`size-${idx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* product grid */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {products
              ? products.map((product) => (
                  <Product product={product!} key={product.id} />
                ))
              : new Array(15)
                  .fill(null)
                  .map((_, i) => <ProductSkeleton key={i} />)}
          </ul>
        </div>
      </div>
    </main>
  );
}
