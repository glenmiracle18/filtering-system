import { ProductTypes } from "@/lib/types";

const Product = ({ product }: { product: ProductTypes }) => {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 p-8 cursor-pointer">
        <img
          src={product.imageId}
          alt="product-image"
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="text-sm mt-1 text-gray-500">
            Size {product.size}, {product.color}
          </p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.price}</p>
      </div>
    </div>
  );
};
export default Product;
