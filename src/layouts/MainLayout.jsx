import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      {/* Outlet is where the page content will be rendered */}
      <Outlet /> 
    </div>
  );
};

export default MainLayout;