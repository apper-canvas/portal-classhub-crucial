import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import NotificationBell from "@/components/molecules/NotificationBell";

const Header = ({ onMobileMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuClick}
          className="lg:hidden p-2"
        >
          <ApperIcon name="Menu" size={20} />
        </Button>

        {/* Page title area - empty for now, can be populated by individual pages */}
        <div className="flex-1 lg:ml-0 ml-4">
          {/* This space can be used by pages to show contextual information */}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          <NotificationBell />
          
          {/* User menu placeholder */}
          <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-primary-900">
              Teacher
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;