import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSideNavbar from '../components/UserSideNavbar';
import UserTopNavbar from '../components/UserTopNavbar';

const Dashboard = () => {
  // You might want to fetch the user data here or pass it from a parent component
  const user = { name: 'John Doe' }; // Example user data

  return (
    <div className="flex flex-col h-screen">
      <UserTopNavbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <div className="pt-1"> {/* Add top padding to push sidebar down */}
          <UserSideNavbar user={user} />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;