import { Product } from "../models/Product";

const APIURL = 'https://fakestoreapi.com/products';
export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(APIURL);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};
