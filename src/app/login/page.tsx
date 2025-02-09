"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:3003/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorMessage = (await response.json()).message;
                throw new Error(errorMessage || "Erreur lors de la connexion");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            window.dispatchEvent(new Event("storage"));
            router.push("/products");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Connexion</h1>
                {error && (
                    <p className="mb-4 text-red-500 text-center">
                        {error}
                    </p>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Nom d'utilisateur
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Se connecter
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Pas encore inscrit ?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Créer un compte
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
