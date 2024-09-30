import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, notification } from "antd";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { cartState, sessionState } from "../atoms/cartstate.js";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const AddressModal = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const cartItems = useRecoilValue(cartState);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  const session = useRecoilValue(sessionState);
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:4000/addresses?userId=${userId}`
        );
        setAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const handleAddAddress = async (values) => {
    if (addresses.length >= 5 && !editAddress) {
      notification.info({
        message: "cannot add more addresses",
        description: "You can only have amaximum of 5 addresses",
      });
      return;
    }

    try {
      if (editAddress) {
        await axios.put(`http://localhost:4000/addresses/${editAddress.id}`, {
          ...values,
          userId,
        });
        setAddresses(
          addresses.map((addr) =>
            addr.id === editAddress.id ? { ...addr, ...values } : addr
          )
        );
      } else {
        const response = await axios.post(`http://localhost:4000/addresses`, {
          ...values,
          userId,
        });
        setAddresses([...addresses, { id: response.data.id, ...values }]);
      }
      setIsAddingNewAddress(false);
      setEditAddress(null);
    } catch (error) {
      notification.error({
        message: "Error adding address",
        description:
          "There was an issue when adding address.Please try again later",
      });
    }
  };

  const handleEditAddress = (address) => {
    setEditAddress(address);
    setIsAddingNewAddress(true);
  };

  const handleNewAddress = () => {
    setEditAddress(null);
    setIsAddingNewAddress(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/addresses/${id}`);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      if (selectedAddress && selectedAddress.id === id) {
        setSelectedAddress(null);
      }
    } catch (error) {
      notification.error({
        message: "Error deleting address",
        description:
          "There was an issue when deleting address.Please try again later",
      });
    }
  };
  const handlePayment = async (selectedAddress) => {
    const orderDetails = {
      id: userId,
      cartItems,
      address: selectedAddress,
    };

    try {
      console.log("posting");
      const response = await axios.post(
        "http://localhost:4000/orders",
        orderDetails
      );
      console.log(response);
      if (response) {
        navigate("/orders/orderhistory");
      }
    } catch (error) {
      console.error("There was an error making the payment!", error);
    }
  };
  const handleNext = (address) => {
    setSelectedAddress(address);
  };
  return (
    <Card>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isAddingNewAddress ? (
            <>
              <h4>Edit Address:</h4>
              <Form
                onFinish={handleAddAddress}
                initialValues={
                  editAddress
                    ? { name: editAddress.name, address: editAddress.address }
                    : { name: "", address: "" }
                }
              >
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter name" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter address" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {editAddress ? "Update Address" : "Add Address"}
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <>
              {addresses.length === 0 ? (
                <>
                  <h4>Add Address:</h4>
                  <Form onFinish={handleAddAddress}>
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item
                      name="address"
                      label="Address"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter address" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Add Address
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              ) : (
                <>
                  <h4>Choose a delivery address:</h4>
                  <div className="addrlist">
                    {addresses.map((address, index) => (
                      <Card
                        key={index}
                        className="addrcard"
                        onClick={() => handleNext(address)}
                      >
                        {selectedAddress?.id === address.id && (
                          <CheckCircleOutlined
                            style={{
                              color: "green",
                              position: "absolute",
                              top: "10px",
                              left: "10px",
                              fontSize: "25px",
                            }}
                          />
                        )}
                        <div className="addrdiv">
                          {address.name}: {address.address}
                          <div className="button-group">
                            <Button
                              type="link"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(address);
                              }}
                              style={{ fontSize: "22px" }}
                            >
                              Edit
                            </Button>
                            <Button
                              type="link"
                              danger
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address.id);
                              }}
                            >
                              <DeleteOutlined style={{ fontSize: "24px" }} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {addresses.length < 5 && (
                    <Button
                      type="primary"
                      onClick={handleNewAddress}
                      style={{ marginRight: "20px" }}
                    >
                      Add New Address
                    </Button>
                  )}
                  {selectedAddress && (
                    <Button
                      type="primary"
                      onClick={() => handlePayment(selectedAddress)}
                    >
                      next
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Card>
  );
};
export default AddressModal;
