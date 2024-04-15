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

export default function Home() {
  const SORT_OPTIONS = [
    { name: "None", value: "none" },
    { name: "Price", value: "asc" },
    { name: "Price", value: "desc" },
  ] as const;
  // declaring it "as conts" will make it a constant and also prevent pushing into the array, like SORT_OPTIONS.PUSH({name: "new", value: "value"}

  // state management for sorting
  const [filter, setFilter] = useState({
    sort: "none",
  });

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
  // console.log(products);

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
          <div></div>
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
