'use client';

import { useProducts } from "@/hooks/useProduct";
import { useCart } from "@/context/CartContext";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function ProductsPage() {
    useAuthRedirect();

    const { products, loading, error } = useProducts();
    const { cart, addToCart, removeFromCart } = useCart();

    const getProductQuantity = (productId: number) => {
        const item = cart.find((item) => item.id === productId);
        return item ? item.quantity : 0;
    };

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
                {products.map((product) => {
                    const quantity = getProductQuantity(product.id);
                    return (
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

                            {/* Compteur */}
                            <div className="flex items-center gap-2 mt-4">
                                <button
                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                    onClick={() => removeFromCart(product.id)}
                                    disabled={quantity === 0}
                                >
                                    -
                                </button>
                                <span className="text-lg font-semibold">{quantity}</span>
                                <button
                                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                    onClick={() => addToCart(product)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
