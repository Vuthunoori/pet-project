import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { Button, Card, Form, Input, Layout, notification } from "antd";
import { sessionState } from "../atoms/cartstate.js";
import Navbar from "./navbar.js";

const { Content, Footer } = Layout;
const ProfilePage = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const session = useRecoilValue(sessionState);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const userId = session.user.id;
          const response = await axios.get(
            `http://localhost:4000/users/${userId}`
          );
          setUserData(response.data);
          setLoading(false);
        } catch (err) {
          notification.error({
            message: "Error loading user data",
            description:
              "There was an issue when fetching user data.Please try again later",
          });
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [session]);

  const handleSubmit = async () => {
    try {
      const userId = session.user.id;
      await axios.put(`http://localhost:4000/users/${userId}`, userData);

      notification.success({
        message: "Profile Updated",
        description: "Your profile has been updated successfully!",
        placement: "top",
      });
    } catch (err) {
      notification.error({
        message: "Error updating profile",
        description:
          "There was an issue when updating profile.Please try again later",
      });
    }
  };
  if (loading) return <div>Loading...</div>;

  return (
    <Layout className="layouts">
      <Navbar />
      <Content className="profile-content">
        <Card
          className="profile-card"
          title={
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                marginLeft: "165px",
              }}
            >
              User Profile
            </span>
          }
        >
          <Form
            onFinish={handleSubmit}
            initialValues={{
              name: userData.name,
              email: userData.email,
            }}
          >
            <Form.Item
              name="name"
              label={<span style={{ fontSize: "20px" }}>Name</span>}
            >
              <Input
                style={{ fontSize: "21px" }}
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item
              name="email"
              label={<span style={{ fontSize: "20px" }}>Email</span>}
              rules={[{ type: "email" }]}
            >
              <Input
                value={userData.email}
                readOnly
                style={{ fontSize: "21px" }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{
                  marginTop: "400px",
                  fontSize: "32px",
                  marginLeft: "137px",
                  height: "40px",
                  width: "250px",
                }}
                type="primary"
                htmlType="submit"
              >
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      <Footer className="foot">Footer Content</Footer>
    </Layout>
  );
};
export default ProfilePage;
