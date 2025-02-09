"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import './globals.css';
import Link from "next/link";
import {CartProvider, useCart} from "@/context/CartContext";

const queryClient = new QueryClient();

function Header() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnected, isConnecting } = useAccount();
    const { cart, cartTotal } = useCart();
    const [isDropdownVisible, setDropdownVisible] = useState(false); // État pour la visibilité de la liste déroulante

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    return (
        <header className="header">
            <h1>Blockchain App</h1>

            <div className="header-buttons">
                <Link href="/">
                    <button>Home</button>
                </Link>
                <Link href="/products">
                    <button>Products</button>
                </Link>

                {/* Cart button */}
                <div className="relative">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={toggleDropdown} // Toggle the dropdown visibility
                    >
                        Cart ({cart.length}) - ${cartTotal.toFixed(2)}
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownVisible && (
                        <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded z-10">
                            {cart.length === 0 ? (
                                <p className="p-4 text-gray-500">Your cart is empty</p>
                            ) : (
                                <ul className="p-4 max-h-64 overflow-y-auto space-y-2">
                                    {cart.map((product, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            <span className="text-sm font-semibold">{product.title}</span>
                                            <span className="text-sm text-gray-600">x{product.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

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
            </div>
        </header>
    );
}

function Body() {
    const { isConnected, address, chain } = useAccount();
    const { data: balance } = useBalance({ address });

    const allowedChains = [1, 11155111]; // Ethereum Mainnet and Sepolia Testnet
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
