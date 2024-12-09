import React, { createContext, useReducer } from "react";

// Create context for the global state
export const Store = createContext();

// Initial state for the store
const initialState = {
  userInfo: {
    cartItems: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod') || '',
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};

// Reducer function to handle actions related to the cart and user
function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      // Check if the item already exists in the cart
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      // Update cart items based on whether the item exists or not
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        : [...state.cart.cartItems, newItem];

      // Save updated cart items to localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };

    case "CART_REMOVE_ITEM":
      // Remove the item from cart based on the ID
      const updatedCartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );

      // Save updated cart items to localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

      return { ...state, cart: { ...state.cart, cartItems: updatedCartItems } };

    case "CART_CLEAR":
      // Clear all cart items
      localStorage.setItem("cartItems", JSON.stringify([]));
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };

    case "USER_SIGNOUT":
      return { 
        ...state, 
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        }
      };

    case "SAVE_SHIPPING_ADDRESS":
      return { ...state, cart: { ...state.cart, shippingAddress: action.payload } };

    case "SAVE_PAYMENT_METHOD":
      return { ...state, cart: { ...state.cart, paymentMethod: action.payload } };

    default:
      return state;
  }
}

// StoreProvider to wrap the app and provide global state
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
