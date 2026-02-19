import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async (limit = 20, skip = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const searchProducts = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/products/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error("Error searching products:", error);
        return { products: [] };
    }
};

export const fetchProductsByCategory = async (category) => {
    try {
        const response = await axios.get(`${BASE_URL}/products/category/${category}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category ${category}:`, error);
        return { products: [] };
    }
};
