"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import './globals.css';
import Link from "next/link";
import {CartProvider, useCart} from "@/context/CartContext";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();

function Header() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnected, isConnecting } = useAccount();
    const { cart, cartTotal, convertedToEtherium  } = useCart();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            setHasToken(!!token);
        };

        checkToken();
        window.addEventListener("storage", checkToken);

        return () => {
            window.removeEventListener("storage", checkToken);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setHasToken(false);
        router.push("/login");
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add some products.");
        } else {
            router.push("/checkout");
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    return (
        <header className="header">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Blockchain App</h1>
                {hasToken && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Déconnexion
                    </button>
                )}
            </div>

            <div className="header-buttons">
                <Link href="/">
                    <button>Home</button>
                </Link>
                <Link href="/products">
                    <button>Products</button>
                </Link>
                <Link href="/transactions">
                    <button>Transactions</button>
                </Link>
                {!isConnected ? (
                    <div>
                        {connectors.map((connector) => (
                            <button
                                key={connector.id}
                                onClick={() => connect({ connector })}
                                disabled={isConnecting}
                            >
                                {isConnecting ? "Connecting..." : `Connect with ${connector.name}`}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div>
                        <button onClick={() => disconnect()}>Disconnect</button>
                    </div>
                )}
                {/* Cart button */}
                <div className="relative">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={toggleDropdown}
                    >
                        Cart ({cart.length}) - ${cartTotal.toFixed(2)}
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownVisible && (
                        <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded z-10">
                            {/* Cart items */}
                            {cart.length === 0 ? (
                                <p className="p-4 text-gray-500">Your cart is empty</p>
                            ) : (
                                <div className="p-4 space-y-2">
                                    <ul className="max-h-64 overflow-y-auto space-y-2">
                                        {cart.map((product, index) => (
                                            <li
                                                key={index}
                                                className="flex justify-between items-center"
                                            >
                                                <div>
                                                    <span className="block font-bold text-sm">
                                                        {product.title}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        Quantity: {product.quantity}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    ${(product.quantity * product.price).toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Total */}
                                    <div className="text-right font-bold">
                                        Total: ${cartTotal.toFixed(2)}
                                        <br/>
                                        Converted: ${convertedToEtherium}
                                    </div>

                                    {/* Pay Now button */}
                                    <button
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
                                        onClick={handleCheckout}
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function Body() {
    const { isConnected, address, chain } = useAccount();
    const { data: balance } = useBalance({ address });

    const allowedChains = [1, 11155111];
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isConnected && !allowedChains.includes(chain?.id ?? -1)) {
            setError('You are connected to an unsupported chain. Please switch to Ethereum Mainnet or Sepolia.');
        } else {
            setError(null);
        }
    }, [chain, isConnected]);

    return (
        <main>
            {error && (
                <div style={{ color: 'red' }}>
                    <p>{error}</p>
                </div>
            )}
            {isConnected && !error && (
                <div>
                    <p>Connected Wallet: {address}</p>
                    <p>Balance: {balance?.formatted} {balance?.symbol}</p>
                </div>
            )}
        </main>
    );
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <CartProvider>
                    <Header />
                    <main>{children}</main>
                    <Body />
                </CartProvider>
            </WagmiProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}
