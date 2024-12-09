import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from './util.jsx';
import { Store } from '../Store.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';


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

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        ' http://localhost:4000/api/orders',
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

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="text-3xl font-bold my-3">Preview Order</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-2/3 px-4">
          <div className="bg-white shadow-lg rounded-md p-4 mb-4">
            <h2 className="text-xl font-semibold mb-3">Shipping</h2>
            <p>
              <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
              <strong>Address: </strong> {cart.shippingAddress.address},{' '}
              {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{' '}
              {cart.shippingAddress.country}
            </p>
            <Link
              to="/shipping"
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Edit
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-md p-4 mb-4">
            <h2 className="text-xl font-semibold mb-3">Payment</h2>
            <p>
              <strong>Method:</strong> {cart.paymentMethod}
            </p>
            <Link
              to="/payment"
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Edit
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-md p-4 mb-4">
            <h2 className="text-xl font-semibold mb-3">Items</h2>
            <ul>
              {cart.cartItems.map((item) => (
                <li key={item._id} className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4">{item.quantity}</span>
                    <span>${item.price}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/cart"
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Edit
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/3 px-4">
          <div className="bg-white shadow-lg rounded-md p-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <ul>
              <li className="flex justify-between mb-3">
                <span>Items</span>
                <span>${cart.itemsPrice.toFixed(2)}</span>
              </li>
              <li className="flex justify-between mb-3">
                <span>Shipping</span>
                <span>${cart.shippingPrice.toFixed(2)}</span>
              </li>
              <li className="flex justify-between mb-3">
                <span>Tax</span>
                <span>${cart.taxPrice.toFixed(2)}</span>
              </li>
              <li className="flex justify-between font-semibold mb-3">
                <span>Total</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </li>
            </ul>
            <div className="mt-4">
              <button
                onClick={placeOrderHandler}
                disabled={cart.cartItems.length === 0}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                Place Order
              </button>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
