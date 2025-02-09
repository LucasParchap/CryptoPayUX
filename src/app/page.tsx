"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="max-w-4xl p-6 bg-white shadow-md rounded-md text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to CryptoPayUX</h1>
                <p className="text-lg text-gray-700 mb-6">
                    A modern decentralized payment system built on blockchain technology. Seamlessly pay with
                    cryptocurrencies, track transactions, and experience the power of decentralization.
                </p>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
                    <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
                        <li>Pay with ETH or stablecoins (USDT, USDC).</li>
                        <li>Immutable blockchain receipts.</li>
                        <li>Real-time payment validation via MetaMask.</li>
                        <li>Transaction history for users and merchants.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
