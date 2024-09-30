import React from "react";
import { Steps, Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar.js";

const { Step } = Steps;
const { Content, Footer } = Layout;
const Stepper = () => {
  const currentStep = window.location.pathname.includes("/orders/orderdetails")
    ? 0
    : window.location.pathname.includes("/orders/address")
    ? 1
    : window.location.pathname === "/orders"
    ? 0
    : 2;
  const stepContainerStyles = {
    minHeight: "90px",

    padding: "25px 0",
  };

  const stepStyles = {
    fontSize: "20px",
    padding: "0  20px",
  };

  return (
    <Layout className="layouts">
      <Navbar />
      <Content className="contents">
        <div style={stepContainerStyles}>
          <Steps
            current={currentStep}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 240px",
              marginBottom: "20px",
            }}
          >
            <Step title={<span style={stepStyles}>Order Details</span>} />
            <Step title={<span style={stepStyles}>Address</span>} />
            <Step title={<span style={stepStyles}>Order</span>} />
          </Steps>
          <Outlet />
        </div>
      </Content>
      <Footer className="foot">Footer Content</Footer>
    </Layout>
  );
};
export default Stepper;
