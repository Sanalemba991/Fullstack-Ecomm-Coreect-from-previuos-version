import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
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

  return (
    <div className="bg-white rounded-lg shadow-md">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="w-full h-64 object-cover rounded-t-lg" alt={product.name} />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <p className="text-xl font-bold text-gray-900">${product.price}</p>
        {product.countInStock === 0 ? (
          <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-md cursor-not-allowed" disabled>
            Out of stock
          </button>
        ) : (
          <button
            onClick={() => addToCartHandler(product)}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Product;
