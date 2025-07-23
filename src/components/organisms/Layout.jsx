import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { NotificationProvider } from "@/contexts/NotificationContext";
const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setIsMobileSidebarOpen(true);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

return (
    <NotificationProvider>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar 
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={handleMobileSidebarClose}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMobileMenuClick={handleMobileMenuClick} />
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default Layout;