import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MenuButton from "../components/MenuButton";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <MenuButton
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar isOpen={sidebarOpen} />

      <Outlet />
    </>
  );
};

export default DashboardLayout;