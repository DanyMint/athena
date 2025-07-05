import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Component for each route
import Analytics from "./pages/Analytics";
import Entrants from "./pages/Entrants";
import CreateReport from "./pages/CreateReport";
import SettingsLayout from "./components/SettingsLayout";
import CommonSettings from "./pages/CommonSettings";
import DirectoryManagement from "./pages/DirectoryManagementSettings";
import NotFound from "./pages/NotFound";

const { Header, Content, Footer, Sider } = Layout;

// Helper function for Menu items
function getItem(label, key, icon, children, path) {
  return {
    key,
    icon,
    children,
    label: <Link to={path}>{label}</Link>,
  };
}

// Define menu items with paths
const items = [
  getItem("Аналитика", "analytics", <PieChartOutlined />, null, "/analytics"),
  getItem("Абитуриенты", "entrants", <TeamOutlined />, null, "/entrants"),
  // getItem(
  //   "Создать отчет",
  //   "create-report",
  //   <FileOutlined />,
  //   null,
  //   "/create-report",
  // ),
  // getItem("Настройки", "settings", <DesktopOutlined />, null, "/settings"),
];

// Компонент меню боковой панели
const SiderMenu = ({ collapsed, onCollapse }) => {
  const location = useLocation(); // Теперь внутри <Router>

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={250} // Ширина раскрытого Sider
      collapsedWidth={80} // Ширина свернутого Sider
      style={{
        position: "fixed",
        height: "100%",
        left: 0,
        top: 0,
        transition: "width 0.3s ease", // Анимация изменения ширины
      }}
    >
      <div className="demo-logo-vertical flex items-center justify-center">
        <h1 className="text-center text-slate-50">Афина</h1>
      </div>
      <Menu
        theme="dark"
        selectedKeys={[location.pathname.slice(1)]} // Автоматический выбор пункта меню
        mode="inline"
        items={items}
        inlineCollapsed={collapsed} // Это поможет меню адаптироваться при сворачивании
        style={{
          transition: "all 0.3s ease", // Плавное изменение всех свойств меню
        }}
        className="custom-menu"
      />
    </Sider>
  );
};

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <SiderMenu
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        />
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 250,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Content style={{ padding: 24 }}>
            <Routes>
              <Route path="/" element={<Analytics />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/entrants" element={<Entrants />} />
              <Route path="/create-report" element={<CreateReport />} />
              {/* <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<CommonSettings />} />
                <Route
                  path="directory-managment"
                  element={<DirectoryManagement />}
                />
              </Route> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Danil Tormin and LLP "Computer and Educational Service" ©2025
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
