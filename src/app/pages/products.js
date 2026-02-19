import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`/api/products?category=${category}`);
      setProducts(res.data);
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-6">All Products</h1>

      <div>
        <label>Category: </label>
        <select
          className="mb-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
