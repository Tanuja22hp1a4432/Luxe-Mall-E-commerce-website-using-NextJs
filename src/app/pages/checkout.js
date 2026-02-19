const Checkout = () => {
  const handleCheckout = () => {
    // Handle checkout logic (e.g., integrating with a payment gateway)
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-6">Checkout</h1>

      <form onSubmit={handleCheckout}>
        <div className="mb-4">
          <label className="block">Name</label>
          <input type="text" required className="w-full p-2 border" />
        </div>

        <div className="mb-4">
          <label className="block">Address</label>
          <input type="text" required className="w-full p-2 border" />
        </div>

        <div className="mb-4">
          <label className="block">Payment Method</label>
          <select className="w-full p-2 border">
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
          Complete Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
