'use client';

import {useProducts} from "@/hooks/useProduct";

export default function ProductsPage() {
    const { products, loading, error } = useProducts();

    if (loading) {
        return <p className="p-6">Loading products...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-500">{error}</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="p-4 bg-white shadow-md rounded-md flex flex-col items-center text-center"
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-48 h-48 object-contain mb-4"
                        />
                        <h2 className="text-lg font-semibold w-full truncate">{product.title}</h2>
                        <p className="text-gray-700 font-bold mb-2">${product.price.toFixed(2)}</p>
                        <button
                            className="mt-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            onClick={() => alert(`Added ${product.title} to cart!`)}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
