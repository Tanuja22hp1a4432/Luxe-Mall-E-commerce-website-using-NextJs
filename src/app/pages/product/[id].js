import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      };
      fetchProduct();
    }
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold">{product.name}</h1>
      <div className="flex">
        <img src={product.image} alt={product.name} className="w-1/2 h-96 object-cover" />
        <div className="ml-6">
          <p className="text-xl font-semibold">${product.price}</p>
          <p className="text-gray-700">{product.description}</p>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
