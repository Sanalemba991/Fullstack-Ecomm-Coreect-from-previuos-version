import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import Product from './components/Product';
import { Helmet } from 'react-helmet-async';
import Loading from './components/Loading';
import Message from './components/Message';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('http://localhost:4000/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Laitonjam Collection</title>
      </Helmet>
      <h1>List of Products</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {products.map((product) => (
            <Product key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
