import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Students", path: "/students", icon: "Users" },
    { name: "Classes", path: "/classes", icon: "BookOpen" },
    { name: "Grades", path: "/grades", icon: "GraduationCap" },
    { name: "Attendance", path: "/attendance", icon: "Calendar" }
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-gray-200 shadow-lg">
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg">
            <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
              ClassHub
            </h1>
            <p className="text-xs text-secondary-400">Student Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md transform scale-105"
                  : "text-secondary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-900 hover:shadow-sm hover:scale-102"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon
                  name={item.icon}
                  className={cn(
                    "w-5 h-5 mr-3 transition-colors",
                    isActive ? "text-white" : "text-secondary-400 group-hover:text-primary-600"
                  )}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="text-xs text-secondary-400 text-center">
          ClassHub v1.0
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;