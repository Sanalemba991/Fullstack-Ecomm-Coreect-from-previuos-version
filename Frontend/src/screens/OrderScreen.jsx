import React, { useState, useEffect, useReducer, useContext } from "react";
import { Loading } from "../components/Loading.jsx";
import Message from "../components/Message.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store.jsx";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
const params=useParams();
const{id:orderId}=params;
  const navigate = useNavigate();
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  useEffect(() => {
    if (!userInfo) {
      return navigate("/login");
    }
    if(
        !order._id||
        (order._id && order._id!==orderId)
    ){
        
    }
  }, []);

  return loading ? (
    <Loading />
  ) : error ? (
    <Message>{error}</Message>
  ) : (
    <div>{/* Your successful order content goes here */}</div>
  );
}

export default OrderScreen;
