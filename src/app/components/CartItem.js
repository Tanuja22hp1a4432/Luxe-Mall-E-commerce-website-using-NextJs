const CartItem = ({ item, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
      <div className="flex-1 ml-4">
        <h3>{item.name}</h3>
        <p>${item.price}</p>
      </div>
      <button onClick={() => onRemove(item.id)} className="text-red-500">Remove</button>
    </div>
  );
};

export default CartItem;
