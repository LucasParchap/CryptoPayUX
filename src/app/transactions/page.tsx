'use client';
import { useEffect, useState } from "react";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("http://localhost:3003/transactions");
            const data = await response.json();
            setTransactions(data);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Historique des transactions</h1>
            <ul>
                {transactions.map((tx, index) => (
                    <li key={index}>
                        De: {tx.from} → Vers: {tx.to} | Montant: {tx.value} CPT | Hash: {tx.hash}
                    </li>
                ))}
            </ul>
        </div>
    );
}
