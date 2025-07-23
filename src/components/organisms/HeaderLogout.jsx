import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import { AuthContext } from '../AppContent';

const HeaderLogout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="text-sm text-secondary-400">
        Welcome, {user.firstName || user.name || 'User'}
      </div>
      <Button
        variant="outline"
        size="sm"
        icon="LogOut"
        onClick={logout}
        className="text-secondary-400 hover:text-error hover:border-error"
      >
        Logout
      </Button>
    </div>
  );
};

export default HeaderLogout;