import React, { useContext, useState } from "react";
import { Route, Routes, BrowserRouter, Link } from "react-router-dom";
import HomeScreen from "./HomeScreen.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import { Store } from "./Store.jsx"; // Store context for cart
import CartScreen from "./screens/CartScreen.jsx";
import SignInScreen from "./screens/SiginScreen.jsx"; // Corrected import
import { StoreProvider } from "./Store.jsx"; // StoreProvider import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressScreen from "./screens/ShippingAddressScreen.jsx";
import SignupScreen from "./screens/SignupScreen.jsx";
import PaymentMethodScreen from "./screens/PaymentMethodScreen.jsx"; // Corrected import
import PlaceOrderScreen from "./screens/PlaceOrderScreen.jsx";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // State for controlling the dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const signOutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <ToastContainer position="bottom-center" limit={1} />

        {/* Header */}
        <header className="bg-gray-800 text-white p-4 sticky top-0 z-10 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            {/* Home Link */}
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-yellow-300"
            >
              Laitonjam Collection
            </Link>

            {/* Cart Link and User Dropdown */}
            <div className="flex items-center space-x-6">
              <Link
                to="/cart"
                className="text-lg text-yellow-500 hover:text-yellow-300 relative"
              >
                Cart
                {cart.cartItems.length > 0 && (
                  <span className="font-bold bg-red-700 text-white rounded-full px-3 py-1 text-sm absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                )}
              </Link>

              {userInfo ? (
                <div className="relative">
                  {/* User Profile Button */}
                  <button
                    className="flex items-center space-x-2 text-white bg-yellow-600 hover:bg-yellow-700 transition-transform hover:scale-110 duration-300 rounded-lg px-2"
                    onClick={toggleDropdown} // Toggle dropdown on click
                  >
                    <span>{userInfo.name}</span> {/* Displaying User's Name */}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          User Profile
                        </Link>
                        <Link
                          to="/orderhistory"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Order History
                        </Link>
                        <div className="my-1 border-t border-gray-200"></div>
                        <Link
                          to="#signout"
                          onClick={signOutHandler}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Admin Dropdown (if user is admin) */}
                  {userInfo && userInfo.isAdmin && (
                    <div className="relative mt-4">
                      <button
                        className="flex items-center space-x-2 text-white bg-red-600 hover:bg-red-700 rounded px-4 py-2"
                        onClick={toggleDropdown} // Toggle dropdown on click
                      >
                        <span>Admin</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                          <div className="p-2">
                            <Link
                              to="/admin/dashboard"
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Dashboard
                            </Link>
                            <Link
                              to="/admin/products"
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Products
                            </Link>
                            <Link
                              to="/admin/orders"
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Orders
                            </Link>
                            <Link
                              to="/admin/users"
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Users
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SignInScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/payment/placeorder" element={<PlaceOrderScreen/>} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} /> {/* Fixed typo here */}
              <Route path="/product/:slug" element={<ProductScreen />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 text-center">
          <div>All rights reserved.</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
