import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import {Store} from "../Store.jsx";
import { toast } from "react-toastify";
import { getError } from "./util.jsx";
function SignInScreen() {
  const navigate=useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {userInfo}=state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        " http://localhost:4000/api/users/signin", // Fixed the URL by removing extra backticks
        {
          email,
          password,
        }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect||'/');

      // You can redirect here if necessary
    } catch (err) {
    toast.error(getError(err));
    }
  };
  useEffect(()=>{
    if(userInfo){
      navigate(redirect);
    }
  },[navigate,redirect,userInfo]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <Helmet>
          <title>Sign In</title>
        </Helmet>

        <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Add onChange handler
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Add onChange handler
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md 
             hover:bg-orange-600 
             focus:ring-orange-500
             transition-transform hover:scale-110 duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={`/signup?redirect=${redirect}`}
              className="text-blue-500 hover:text-blue-700"
            >
              Create new Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInScreen;
