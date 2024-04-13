const ProductSkeleton = () => {
  return (
    <div className="animate-pulse relative">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 p-8 cursor-pointer"></div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="w-full h-4 bg-gray-200 " />
        <div className="w-full h-4 bg-gray-200"></div>
      </div>
    </div>
  );
};
export default ProductSkeleton;
