import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import CartModal from "./Cart.js";
import axios from "axios";
import { Grid, Menu, theme } from "antd";
import { sessionState } from "../atoms/cartstate.js";
import { useRecoilValue } from "recoil";
import { MenuOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { createFromIconfontCN } from "@ant-design/icons";

const IconFont = createFromIconfontCN({
  scriptUrl: [
    "//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js",
    // icon-javascript, icon-java, icon-shoppingcart (overridden)
    "//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js",
  ],
});

function Navbar() {
  const { useToken } = theme;
  const { useBreakpoint } = Grid;
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const session = useRecoilValue(sessionState);

  const menuItems = [
    {
      label: <span style={{ color: "white" }}>Home</span>,
      key: "home",
    },
  ];

  const [current, setCurrent] = useState("projects");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    switch (e.key) {
      case "home":
        navigate("/");
        break;

      default:
        break;
    }
  };

  const styles = {
    header: {
      backgroundColor: token.colorBgContainer,
      borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
      height: "60px",
      backgroundColor: "#001529",
      padding: "0 20px",
      position: "relative",
    },
    menu: {
      backgroundColor: "transparent",
      borderBottom: "none",
      lineHeight: screens.sm ? "4rem" : "3.5rem",
      marginLeft: screens.md ? "0px" : `-${token.size}px`,
      width: screens.md ? "inherit" : token.sizeXXL,
      fontSize: "1.7rem",
    },
    menuContainer: {
      alignItems: "center",
      display: "flex",
      gap: token.size,
      justifyContent: "space-between",
      width: "100%",
      height: "50px",
      color: "white",
    },
    iconContainer: {
      display: "flex",
      alignItems: "center",
      gap: "26px",
      marginTop: "5px",
    },
  };

  const handleSignOut = async () => {
    try {
      const userId = session.user.id;
      console.log(`signout`, userId);

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
        alert("Failed to sign out. Please try again.");
        return;
      }

      if (userId) {
        await axios.delete(`http://localhost:4000/users/${userId}`);
      }

      navigate("/");
    } catch (error) {
      console.error("Error during sign-out:", error.message);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  const handleCloseCartModal = () => {
    setIsCartModalVisible(false);
  };
  const handleProfileClick = () => {
    navigate("/profile");
  };
  return (
    <>
      <nav style={styles.header}>
        <div style={styles.menuContainer}>
          <Menu
            style={styles.menu}
            mode="horizontal"
            items={menuItems}
            onClick={onClick}
            selectedKeys={screens.md ? [current] : ""}
            overflowedIndicator={<Button type="text" icon={<MenuOutlined />} />}
          />
          <div style={styles.iconContainer}>
            <Avatar
              size="large"
              style={{ fontSize: "35px" }}
              onClick={handleProfileClick}
              icon={<UserOutlined />}
            />
            <IconFont
              type="icon-shoppingcart"
              onClick={() => setIsCartModalVisible(true)}
              style={{ fontSize: "40px" }}
            />
            <CustomerServiceOutlined
              style={{ fontSize: "38px" }}
              onClick={() => {
                navigate("/orders/orderhistory");
              }}
            />
            <Button
              className="header-button sign-out"
              type="primary"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <CartModal visible={isCartModalVisible} onClose={handleCloseCartModal} />
    </>
  );
}

export default Navbar;
