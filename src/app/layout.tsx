'use client';

import { ReactNode, useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import './globals.css';
import Link from "next/link";

const queryClient = new QueryClient();

function Header() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnected, isConnecting } = useAccount();

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
                {/* Connexion / déconnexion */}
                {!isConnected ? (
                    <div>
                        {connectors.map((connector) => (
                            <button
                                key={connector.id}
                                onClick={() => connect({ connector })}
                                disabled={isConnecting}
                            >
                                {isConnecting ? 'Connecting...' : `Connect with ${connector.name}`}
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
                <Header />
                <main>{children}</main>
                <Body />
            </WagmiProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}
