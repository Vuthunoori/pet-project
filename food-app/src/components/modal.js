// components/CartModal.js
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useRecoilValue } from 'recoil';
import { cartState } from '../atoms/cartstate';

const CartModal = ({ visible,onClose, onReplace,name}) => {
  const cart = useRecoilValue(cartState);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  console.log(`carttttt`,cart);
  // Get the restaurant details from the cart
 
  const restaurant = cart.length > 0 ? cart[0].restaurantName : "No restaurant added";
 
  return (
    <Modal
    title={<span style={{ fontSize: '30px', fontWeight: 'bold' ,}}>Replace cart item?</span>}
      
      open={visible}
      onCancel={onClose}
      footer={[
        <Button type="primary" key="close" onClick={onClose}>
                    Close
                </Button>,
        <Button type="primary" key="back" onClick={onReplace}>
          Replace
        </Button>,
      ]}
    >
      <p style={{ fontSize: '20px'}}> Your cart contains dishes from {restaurant}. Do you want to discard the selection and add dishes from {name}?</p>
     
      
    </Modal>
  );
};

export default CartModal;
