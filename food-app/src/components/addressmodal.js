import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button,Card,notification } from 'antd';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import {  useNavigate } from 'react-router-dom';
import { cartState} from '../atoms/cartstate.js';

const AddressModal = ({ visible, onClose, userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const cartItems = useRecoilValue(cartState);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/addresses?userId=${userId}`);
        setAddresses(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId ) {
      fetchAddresses();
    }
  }, [userId]);

  const handleAddAddress = async (values) => {
    if (addresses.length >= 5 && !editAddress) {
      // alert('You can only have a maximum of 5 addresses.');
      notification.info({
        message:'cannot add more addresses',
        description:'You can only have amaximum of 5 addresses',
      });
      return;
    }

    try {
      if (editAddress) {
        await axios.put(`http://localhost:4000/addresses/${editAddress.id}`, { ...values, userId });
        setAddresses(
          addresses.map((addr) => (addr.id === editAddress.id ? { ...addr, ...values } : addr))
        );
      } else {
        const response = await axios.post(`http://localhost:4000/addresses`, { ...values, userId });
        setAddresses([...addresses, { id: response.data.id, ...values }]); // Update addresses list with the new address, assuming the new ID comes from the response
      }
      setIsAddingNewAddress(false);
      setEditAddress(null);
    } catch (error) {
      notification.error({
        message:'Error adding address',
        description:'There was an issue when adding address.Please try again later',
      });
    }
  };

  const handleEditAddress = (address) => {
    setEditAddress(address);
    setIsAddingNewAddress(true); // Show the form for editing
  };

  const handleNewAddress = () => {
    setEditAddress(null); // Reset edit state
    setIsAddingNewAddress(true); // Show the form for adding a new address
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/addresses/${id}`); // Delete the address by ID
      setAddresses(addresses.filter((addr) => addr.id !== id)); // Update the state to remove the deleted address
    } catch (error) {
      notification.error({
        message:'Error deleting address',
        description:'There was an issue when deleting address.Please try again later',
      });
    }
  };
  const handlePayment = async(selectedAddress) => {
   
          const orderDetails = {
            id:userId ,
            cartItems,
            address: selectedAddress,
            // itemTotal: itemTotal.toFixed(2),
            // gst: gst.toFixed(2),
            // deliveryCharge: deliveryCharge.toFixed(2),
            // totalAmount: totalAmount.toFixed(2)
          };
          
      //     // Store the order details in local storage
      //     localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      // navigate('/order');
      try {
        // Post order details to the JSON server
        console.log('posting');
        const response= await axios.post('http://localhost:4000/orders', orderDetails);
    console.log(response);
         if(response)
          {
             navigate('/order');
           }
    
     
       
      } catch (error) {
        console.error("There was an error making the payment!", error);
        
      }
     
     // Adjust delay as needed
    };
      
  return (
    <Modal
     
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isAddingNewAddress ? (
            // Show form for adding/editing an address
            <>
            <h4>Edit Address:</h4>
            <Form
              onFinish={handleAddAddress}
              initialValues={editAddress ? { name: editAddress.name, address: editAddress.address } : { name: '', address: '' }} // Pre-fill form when editing
            >
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="Enter name" />
              </Form.Item>
              <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                <Input placeholder="Enter address" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editAddress ? 'Update Address' : 'Add Address'}
                </Button>
              </Form.Item>
            </Form>
            </>
          ) : (
            <>
              {addresses.length === 0 ? (
                // Show the form if there are no addresses stored
                <>
                <h4>Add Address:</h4>
                <Form onFinish={handleAddAddress}>
                  <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input placeholder="Enter name" />
                  </Form.Item>
                  <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                    <Input placeholder="Enter address" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">Add Address</Button>
                  </Form.Item>
                </Form>
                </>
              ) : (
                <>
                  <h4>Choose a delivery address:</h4>
                 <div className='addrlist'>
                    {addresses.map((address, index) => (
                      <Card key={index} className='addrcard'    onClick={() => handlePayment(address)} >
                        <div className='addrdiv'>
                        {address.name}: {address.address}
                        <div className="button-group">
                        <Button
                          type="link"
                          onClick={() => handleEditAddress(address)} // Pass the address to edit
                        >
                          Edit
                        </Button>
                        <Button
                          type="link"
                          danger
                          onClick={() => handleDeleteAddress(address.id)} // Pass the address ID to delete
                        >
                          Delete
                        </Button>
                        </div>
                        </div>
                        </Card>
                    ))}
                
                </div>
                  {/* Show the Add New Address button if there are fewer than 5 addresses */}
                  {addresses.length < 5 && (
                    <Button type="primary" onClick={handleNewAddress}>
                      Add New Address
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default AddressModal;