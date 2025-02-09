"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/models/Product";

interface CartItem extends Product {
    quantity: number; // Ajout d'une quantité pour chaque article
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prevCart.filter((item) => item.id !== productId);
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
