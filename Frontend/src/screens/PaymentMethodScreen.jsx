import React, { useContext, useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  
  const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'Paypal');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('placeorder');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <div>
        <h1>Payment</h1>
        <form onSubmit={submitHandler}>
          <div>
            <input
              type="radio"
              id="Paypal"
              name="paymentMethod"
              value="Paypal"
              onChange={(e) => setPaymentMethodName(e.target.value)}
              checked={paymentMethodName === 'Paypal'}
            />
            <label htmlFor="Paypal">PayPal</label>
          </div>
          <div>
            <input
              type="radio"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={(e) => setPaymentMethodName(e.target.value)}
              checked={paymentMethodName === 'Stripe'}
            />
            <label htmlFor="Stripe">Credit Card</label>
          </div>

          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default PaymentMethodScreen;
