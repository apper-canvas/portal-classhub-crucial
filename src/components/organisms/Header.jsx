import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  subtitle,
  onMobileMenuClick,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  onSearchClear,
  searchPlaceholder = "Search...",
  actions,
  className 
}) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 shadow-sm", className)}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              onClick={onMobileMenuClick}
              className="lg:hidden mr-2"
            />
            
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-primary-900 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-secondary-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Center section - Search */}
          {showSearch && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                onClear={onSearchClear}
                placeholder={searchPlaceholder}
              />
            </div>
          )}

          {/* Right section - Actions */}
          <div className="flex items-center space-x-3">
            {actions}
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" icon="Bell" className="relative">
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
            
            {/* User menu */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-primary-900">Teacher</p>
                <p className="text-xs text-secondary-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              onClear={onSearchClear}
              placeholder={searchPlaceholder}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;