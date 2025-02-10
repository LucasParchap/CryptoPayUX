'use client';

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import { useState } from 'react';

export default function CheckoutPage() {
    useAuthRedirect();

    const { cart, cartTotal, convertedToEtherium } = useCart();
    const { address, isConnected } = useAccount();
    const [isProcessing, setIsProcessing] = useState(false);

    const tokenAddress = '0x79169dDE8d0401DD52deb5396c4E5D56fAFbb383';
    const paymentProcessorAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    async function handleAuthorize() {
        if (!isConnected) {
            alert('Please connect your wallet first.');
            return;
        }

        try {
            setIsProcessing(true);

            // Demander au wallet un provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Configuration du contrat ERC-20
            const tokenAbi = ['function approve(address spender, uint256 amount) public returns (bool)'];
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

            // Appel de `approve` pour autoriser le contrat PaymentProcessor
            const amountToApprove = ethers.constants.MaxUint256;
            const tx = await tokenContract.approve(paymentProcessorAddress, amountToApprove);
            await tx.wait();

            alert('Authorization successful!');
        } catch (error) {
            alert('Authorization failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleDirectPayment() {
        if (!isConnected) {
            alert('Please connect your wallet first.');
            return;
        }

        try {
            setIsProcessing(true);

            // Demander au wallet un provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Configuration du contrat ERC-20
            const tokenAbi = ['function transfer(address recipient, uint256 amount) public returns (bool)'];
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

            // Configuration du transfert
            const recipientAddress = "0xCD390A9f3F1039139cB14928D29607b1E1E90DDD";
            const amountToSend = ethers.utils.parseUnits(convertedToEtherium.toString(), 18);

            // Appel de `transfer`
            const tx = await tokenContract.transfer(recipientAddress, amountToSend);
            console.log("Transaction sent:", tx.hash);

            // Attendre que la transaction soit confirmée
            await tx.wait();
            alert('Payment successful!');
        } catch (error) {
            console.error("Payment failed:", error.message);
            alert('Payment failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    }

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
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleAuthorize}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Authorizing...' : 'Authorize'}
                </button>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleDirectPayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </div>
    );
}
