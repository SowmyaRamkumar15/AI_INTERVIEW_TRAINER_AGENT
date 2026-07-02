import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex-1 lg:ml-64 bg-slate-50 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
