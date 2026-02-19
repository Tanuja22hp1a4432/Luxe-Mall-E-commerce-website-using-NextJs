import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../store/cartSlice';
import CartItem from '../components/CartItem';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-6">Your Cart</h1>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} onRemove={handleRemoveFromCart} />
        ))}
      </div>
    </div>
  );
};

export default Cart;
