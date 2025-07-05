import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu } from "antd";

const items = [
  {
    label: (
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? "text-blue-600 font-bold" : "text-gray-700"
        }
      >
        Общие
      </NavLink>
    ),
    key: "common",
  },
  {
    label: (
      <Link to="/settings/directory-managment">Управление справочниками</Link>
    ),
    key: "DirectoryManagement",
  },
];

const SettingsLayout = () => {
  return (
    <>
      <Menu
        className="fixed w-full z-10 top-0 py-4"
        mode="horizontal"
        items={items}
      />

      <div className="pt-10">
        <Outlet />
      </div>
    </>
  );
};
export default SettingsLayout;
