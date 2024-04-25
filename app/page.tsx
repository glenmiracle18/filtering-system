"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import debounce from "lodash.debounce";

export default function Home() {
  const SORT_OPTIONS = [
    { name: "None", value: "none" },
    { name: "Price", value: "asc" },
    { name: "Price", value: "desc" },
  ] as const;
  // declaring it "as conts" will make it a constant and also prevent pushing into the array, like SORT_OPTIONS.PUSH({name: "new", value: "value"}

  // default constants for product sorting
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

  const PRICE_FILTER = {
    id: "price",
    name: "Price",
    options: [
      { value: [0, 100], label: "Any Price" },
      { value: [0, 40], label: "Under $40" },
      { value: [0, 20], label: "Under $20" },
      // custum defined and updated in jsx
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
  // this is the default state of the filter, and can be mutated with several changes
  const [filter, setFilter] = useState<ProductState>({
    sort: "none",
    color: ["white", "biege", "blue", "green", "purple"],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE }, // if the price is not custom set apply the default price range, which is from 1 to 100
    size: ["S", "L", "M"],
  });

  // quick data fetch demo using tanstack query
  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<ProductTypes[]>(
        "http://localhost:3000/api/products",
        {
          filter: {
            sort: filter.sort,
            color: filter.color,
            price: filter.price.range,
            size: filter.size,
          },
        },
      );
      return data; // this data value is the parsed to the parent above, which is renamed to producst
    },
  });

  const onSubmit = () => refetch();

  // debouncing
  const debounceSubmit = debounce(onSubmit, 400);
  const _debounceSubmit = useCallback(debounceSubmit, []);

  // general function to apply the filter function to only arrays (color, size) of the the filter array
  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">; // property is expected to be one of the keys of the filter object, excluding the keys "price" and "sort".
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
    _debounceSubmit();
  };

  // price ranges
  const minPrice = Math.min(filter.price.range[0], filter.price.range[1]);
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-green-900">
          High-quality cotton selection{" "}
          <p className="tracking tight font-medium text-sm mt-2 text-green-600">
            ( by Glen Miracle)
          </p>
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex text-sm font-medium text-green-700 hover:text-green-900">
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
                    onClick={() => {
                      setFilter((prev) => ({
                        ...prev,
                        sort: option.value,
                      }));
                      _debounceSubmit();
                    }}
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

            {/* price filter */}
            <Accordion type="multiple" className="animate-none">
              <AccordionItem value="price">
                <AccordionTrigger className="font-medium text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Prize</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 animate-none">
                  <ul className="space-y-4">
                    {PRICE_FILTER.options.map((option, idx) => (
                      <li key={option.label} className="flex items-center">
                        <input
                          type="radio"
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }));
                          }}
                          // this check status will only one item to be selected at a time.
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          id={`price-${idx}`}
                          className=" h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`size-${idx}`} // taken from the input elemenent
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}

                    {/* custom filter */}
                    <li className="flex flex-col gap-2 justify-center">
                      <div>
                        <input
                          type="radio"
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100],
                              },
                            }));
                          }}
                          // this check status will only one item to be selected at a time.
                          checked={filter.price.isCustom}
                          id={`price-${PRICE_FILTER.options.length}`}
                          className=" h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`size-${PRICE_FILTER.options.length}`} // taken from the input elemenent
                          className="ml-3 text-sm text-gray-600"
                        >
                          Custom
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>
                        <div>
                          {filter.price.isCustom
                            ? minPrice.toFixed(0)
                            : filter.price.range[0].toFixed(0)}{" "}
                          $ -{" "}
                          {filter.price.isCustom
                            ? maxPrice.toFixed(0)
                            : filter.price.range[1].toFixed(0)}{" "}
                          $
                        </div>
                      </div>
                      <Slider
                        step={5}
                        className={cn({
                          "mt-4 flex justify-center items-center": true,
                          "opacity-50": !filter.price.isCustom,
                        })}
                        disabled={!filter.price.isCustom}
                        value={
                          filter.price.isCustom
                            ? filter.price.range
                            : DEFAULT_CUSTOM_PRICE
                        }
                        min={DEFAULT_CUSTOM_PRICE[0]}
                        max={DEFAULT_CUSTOM_PRICE[1]}
                        defaultValue={DEFAULT_CUSTOM_PRICE}
                        // manages slider movement funtionality
                        onValueChange={(range) => {
                          const [newMin, newMax] = range;
                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [newMin, newMax],
                            },
                          }));
                          debounceSubmit();
                        }}
                      />
                    </li>
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
