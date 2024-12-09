import React, { useContext, useEffect, useReducer } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { useReducer } from 'react';


const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

function PlaceOrderScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const navigate = useNavigate();
  const [{loading,error},dispatch]=useReducer(reducer,{
    loading:false,
    error:'',
  });

  // Helper function to round numbers to two decimal places
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  // Calculate cart prices
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 0 ? round2(10) : 0;
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  // Redirect to payment if no payment method is selected
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  // Handler to place the order
  const PlaceOrderHandler = async () => {
    if (cart.cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }
    // Place the order logic (e.g., API call)
    // ctxDispatch({ type: 'PLACE_ORDER', payload: orderData });
    navigate('/order-summary'); // Navigate to order summary page (example)
  };

  return (
    <div className="container mx-auto px-4">
      <CheckoutSteps step1 step2 step3 step4 />

      <Helmet>
        <title>Place Order</title>
      </Helmet>

      <div className="flex justify-between space-x-8 my-8">
        {/* Left Side - Other Sections (Shipping, Payment, Cart Items) */}
        <div className="flex-1 space-y-8">
          {/* Shipping Information Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <strong className="text-lg">Name:</strong>
                <span className="text-gray-700">{cart.shippingAddress.fullname}</span>
              </div>
              <div className="flex flex-col">
                <strong className="text-lg">Address:</strong>
                <span className="text-gray-700">
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </span>
              </div>
              <Link to="/shipping" className="text-blue-600 hover:underline">Edit</Link>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
            <div className="space-y-4">
              <div>
                <strong>Method:</strong>
                <span className="text-gray-700">{cart.paymentMethod}</span>
              </div>
              <Link to="/payment" className="text-blue-600 hover:underline">Edit</Link>
            </div>
          </div>

          {/* Cart Items Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Items</h2>
            <div>
              {cart.cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center mb-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                  <Link to={`/product/${item.slug}`} className="text-blue-600 hover:underline">
                    {item.name}
                  </Link>
                  <div className="text-gray-700">
                    <span>{item.quantity}</span> x <span>${item.price}</span>
                  </div>
                </div>
              ))}
              <Link to="/cart" className="text-blue-600 hover:underline">Edit</Link>
            </div>
          </div>
        </div>

        {/* Order Summary Section - Right Side */}
        <div className="bg-white shadow-md rounded-lg p-6 w-1/3 h-[300px]">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>Items</p>
              <p>${cart.itemsPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>${cart.shippingPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Tax</p>
              <p>${cart.taxPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-semibold">
              <p>Total</p>
              <p>${cart.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={PlaceOrderHandler}
            disabled={cart.cartItems.length === 0}
            className="w-full bg-blue-600 text-white py-2 mt-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderScreen;
