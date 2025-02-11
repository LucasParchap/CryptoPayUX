'use client';
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function formatDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Date invalide" : date.toLocaleString();
}

function formatValue(valueInWei) {
    try {
        return ethers.utils.formatUnits(valueInWei, 18); // Convertit de wei à tokens
    } catch (error) {
        return valueInWei; // Retourne la valeur brute si une erreur survient
    }
}

function parseItems(items) {
    try {
        if (!items) return []; // Retourne un tableau vide si items est null ou undefined
        const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
        return Array.isArray(parsedItems) ? parsedItems : [];
    } catch (error) {
        console.error("Erreur lors de l'analyse des articles :", error);
        return [];
    }
}

export default function TransactionsPage() {
    const [allTransactions, setAllTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [isAllDropdownOpen, setIsAllDropdownOpen] = useState(false);
    const [isFilteredDropdownOpen, setIsFilteredDropdownOpen] = useState(false);

    useEffect(() => {
        async function fetchAllTransactions() {
            const response = await fetch("http://localhost:3003/transactions");
            const data = await response.json();
            setAllTransactions(data);
        }

        async function fetchFilteredTransactions() {
            const response = await fetch("http://localhost:3003/transactions/filtered");
            const data = await response.json();
            setFilteredTransactions(data);
        }

        fetchAllTransactions();
        fetchFilteredTransactions();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Historique des transactions</h1>
            {/* Affichage de toutes les transactions */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Toutes les transactions</h2>

                <div className="relative">
                    <button
                        onClick={() => setIsAllDropdownOpen(!isAllDropdownOpen)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full text-left flex justify-between items-center"
                    >
                        {isAllDropdownOpen ? "Masquer les transactions" : "Afficher les transactions"}
                        <span className={isAllDropdownOpen ? "rotate-180 transform" : ""}>
                            ▼
                        </span>
                    </button>

                    {isAllDropdownOpen && (
                        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <ul className="divide-y divide-gray-200">
                                {allTransactions.map((tx, index) => (
                                    <li key={index} className="p-4 hover:bg-gray-50">
                                        <p>
                                            <strong>De:</strong> {tx.from || "N/A"}{" "}
                                            <strong>→ Vers:</strong> {tx.to || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Montant:</strong> {formatValue(tx.value)} CPT
                                        </p>
                                        <p>
                                            <strong>Hash:</strong> {tx.hash}
                                        </p>
                                        <p>
                                            <strong>TimeStamp:</strong> {tx.timeStamp}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
            {/* Affichage des transactions filtrées */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Transactions filtrées</h2>

                <div className="relative">
                    <button
                        onClick={() => setIsFilteredDropdownOpen(!isFilteredDropdownOpen)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md w-full text-left flex justify-between items-center"
                    >
                        {isFilteredDropdownOpen ? "Masquer les transactions filtrées" : "Afficher les transactions filtrées"}
                        <span className={isFilteredDropdownOpen ? "rotate-180 transform" : ""}>
                            ▼
                        </span>
                    </button>

                    {isFilteredDropdownOpen && (
                        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <ul className="divide-y divide-gray-200">
                                {filteredTransactions.map((tx, index) => {
                                    const items = parseItems(tx.items); // Analyse les items
                                    const totalPrice = items.reduce((sum, item) => {
                                        return sum + (item.price || 0) * (item.quantity || 0);
                                    }, 0);

                                    return (
                                        <li key={index} className="p-4 hover:bg-gray-50">
                                            <p>
                                                <strong>De:</strong> {tx.from_address || "N/A"}{" "}
                                                <strong>→ Vers:</strong> {tx.to_address || "N/A"}
                                            </p>
                                            <p>
                                                <strong>Montant:</strong> {formatValue(tx.value)} CPT
                                            </p>
                                            <p>
                                                <strong>Hash:</strong> {tx.hash}
                                            </p>
                                            <p>
                                                <strong>Date:</strong> {formatDate(tx.date)}
                                            </p>
                                            <p>
                                                <strong>Total des articles:</strong> {totalPrice.toFixed(2)} $
                                            </p>
                                            <p>
                                                <strong>Articles:</strong>
                                            </p>
                                            <ul className="list-disc ml-6">
                                                {items.map((item, itemIndex) => (
                                                    <li key={itemIndex}>
                                                        {item.title} (x{item.quantity}) - ${item.price?.toFixed(2)} chacun
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
