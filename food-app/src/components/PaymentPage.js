import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Layout } from "antd";
import { useRecoilValue } from "recoil";
import { cartState } from "../atoms/cartstate.js";
const { Content } = Layout;

const PaymentPage = () => {
  const cartItems = useRecoilValue(cartState);
  const navigate = useNavigate();
  const { Meta } = Card;
  const itemTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const gst = itemTotal * 0.1; // Assume 10% GST
  const deliveryCharge = 5.0;
  const totalAmount = itemTotal + gst + deliveryCharge;

  return (
    <Layout className="layouts">
      <Content className="contents">
        <h2 style={{ fontSize: "30px" }}>Your Order</h2>
        {cartItems.length === 0 ? (
          <p style={{ fontSize: "30px" }}>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <Card key={index} style={{ marginBottom: "20px" }}>
                <Meta
                  title={<h3 style={{ marginBottom: "0px" }}>{item.name}</h3>}
                  description={
                    <div>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="menu-item-image"
                      />
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  }
                />
              </Card>
            ))}

            <div>
              <h3>Item Total: ${itemTotal.toFixed(2)}</h3>
              <p>GST (10%): ${gst.toFixed(2)}</p>
              <p>Delivery Charge: ${deliveryCharge.toFixed(2)}</p>
              <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
            </div>
          </div>
        )}
        {cartItems.length > 0 && (
          <>
            <Button type="primary" onClick={() => navigate("/orders/address")}>
              Confirm Payment
            </Button>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default PaymentPage;
