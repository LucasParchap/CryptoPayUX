"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/models/Product";

interface CartItem extends Product {
    quantity: number; // Ajout d'une quantité pour chaque article
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    cartTotal: number;
    convertedToEtherium: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [convertedToEtherium, setConvertedToEtherium] = useState<number>(0);

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Fetch Ethereum conversion whenever cartTotal changes
    useEffect(() => {
        if (cartTotal > 0) {
            const fetchConversion = async () => {
                try {
                    const response = await fetch("http://localhost:3003/crypto/convert-fiat", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ montant: cartTotal }), // Use "montant" as in your backend
                    });

                    console.log(response);

                    if (!response.ok) {
                        throw new Error("Erreur lors de la conversion de la devise");
                    }

                    const data = await response.json();
                    setConvertedToEtherium(data.montant_eth);
                } catch (error) {
                    console.error("Erreur de conversion:", error);
                    setConvertedToEtherium(0); // Reset on failure
                }
            };

            fetchConversion();
        } else {
            setConvertedToEtherium(0);
        }
    }, [cartTotal]); // Runs every time `cartTotal` changes

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
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal, convertedToEtherium }}>
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
