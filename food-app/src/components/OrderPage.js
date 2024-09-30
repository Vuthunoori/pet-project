import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Card, notification } from "antd";
import { useRecoilState } from "recoil";
import { cartState } from "../atoms/cartstate.js";
import axios from "axios";

const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [carts, setCarts] = useRecoilState(cartState);
  const { Meta } = Card;

  useEffect(() => {
    setCarts([]);
  }, []);
  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await axios.get("http://localhost:4000/orders");

        if (response) {
          setOrderHistory(response.data);
        }
      } catch (error) {
        notification.error({
          message: "Error Fetching Order Details",
          description:
            "There was an issue fetching order details.Please try again later",
        });
      }
    };

    fetching();
  }, []);

  return (
    <Layout className="layouts">
      <div>
        <h2 style={{ fontSize: "30px" }}>Your Order History</h2>
        {orderHistory.length === 0 ? (
          <p
            style={{
              fontSize: "35px",
              marginLeft: "700px",
              marginTop: "300px",
            }}
          >
            Your order history is empty.
          </p>
        ) : (
          <div>
            {orderHistory.map((order, index) => (
              <Card
                key={index}
                title={`Order #${index + 1}`}
                style={{ marginBottom: "20px" }}
              >
                {order.cartItems.map((item, idx) => (
                  <Meta
                    key={idx}
                    title={<h3>{item.name}</h3>}
                    description={
                      <div>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    }
                  />
                ))}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default OrderHistoryPage;
