import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
