import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";
import { useRecoilState } from "recoil";
import { cartState } from "../atoms/cartstate.js";

const CartModal = ({ visible, onClose }) => {
  const [cartItems, setCartItems] = useRecoilState(cartState);
  const navigate = useNavigate();

  const handleIncreaseQuantity = (index) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      );
      return updatedCartItems;
    });
  };
  const handleDecreaseQuantity = (index) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems
        .map((item, i) =>
          i === index
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        )
        .filter(
          (item, i) => !(i === index && prevCartItems[index].quantity === 1)
        );
      return updatedCartItems;
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter((_, i) => i !== index);
      return updatedCartItems;
    });
  };

  const handlePayment = () => {
    navigate("/orders");
  };

  const handleReset = () => {
    setCartItems([]);
  };

  return (
    <Modal
      title="Your Cart"
      open={visible}
      onCancel={onClose}
      footer={[
        cartItems.length > 0 && (
          <Button
            type="primary"
            onClick={handlePayment}
            style={{ marginTop: "20px" }}
          >
            Proceed to Payment
          </Button>
        ),
        cartItems.length > 0 && (
          <Button key="reset" type="primary" onClick={handleReset}>
            Cancel Orders
          </Button>
        ),
        <Button key="ok" type="primary" onClick={onClose}>
          Ok
        </Button>,
      ]}
    >
      {cartItems.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            color: "red",
            fontStyle: "lora",
          }}
        >
          Your cart is empty.
        </p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index} style={{ marginBottom: "20px" }}>
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="menu-item-image"
                />
                <Button
                  style={{ marginLeft: "10px" }}
                  type="primary"
                  onClick={() => handleDecreaseQuantity(index)}
                >
                  -
                </Button>
                <p style={{ margin: "0 10px" }}>{item.quantity}</p>
                <Button
                  type="primary"
                  onClick={() => handleIncreaseQuantity(index)}
                >
                  +
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleRemoveItem(index)}
                  style={{ marginLeft: "20px" }}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default CartModal;
