import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Message from '../components/Message';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          {cartItems.length === 0 ? (
            <Message>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </Message>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <Link to={`/product/${item.slug}`} className="text-lg font-medium text-blue-600">
                      {item.name}
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => updateCartHandler(item, item.quantity - 1)}
                      className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                      disabled={item.quantity === 1}
                    >
                      <i className="fas fa-minus-circle"></i>
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateCartHandler(item, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                      disabled={item.quantity === item.countInStock}
                    >
                      <i className="fas fa-plus-circle"></i>
                    </button>
                  </div>
                  <div className="text-lg font-semibold">${item.price}</div>
                  <div>
                    <button
                      onClick={() => removeItemHandler(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="space-y-4">
              <div className="text-lg font-medium">
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items): $
                {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
              </div>
              <div>
                <button
                  onClick={checkoutHandler}
                  className={`w-full py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 ${
                    cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
