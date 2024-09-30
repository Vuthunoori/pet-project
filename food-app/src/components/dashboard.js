import React from "react";
import { Layout } from "antd";
import RestaurantListings from "./RestaurantListings.js";
import Navbar from "./navbar.js";

const { Content, Footer } = Layout;

function Dashboard() {
  return (
    <Layout className="layouts">
      <Navbar />
      <Content className="content">
        <RestaurantListings />
      </Content>
      <Footer className="footer">Footer Content</Footer>
    </Layout>
  );
}

export default Dashboard;
