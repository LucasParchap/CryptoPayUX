'use client';

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function CheckoutPage() {
    useAuthRedirect();
    const { cart, cartTotal, convertedToEtherium } = useCart();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>
            <div className="mb-4">
                {cart.length === 0 ? (
                    <p>
                        Your cart is empty.{" "}
                        <Link href="/products" className="text-blue-500 underline">
                            Continue shopping
                        </Link>.
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {cart.map((product, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <div>
                                    <span className="font-bold">{product.title}</span>
                                    <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                                </div>
                                <span>${(product.quantity * product.price).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="text-right font-bold text-lg mb-6">Total: ${cartTotal.toFixed(2)}</div>
            <div className="text-right font-bold text-lg mb-6">Crypto: ${convertedToEtherium}</div>

            <div className="flex justify-between">
                <Link href="/products">
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        Continue Shopping
                    </button>
                </Link>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => alert("Payment will be implemented later.")}
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
}
