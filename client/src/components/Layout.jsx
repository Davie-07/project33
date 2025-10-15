import React from 'react';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <ThemeToggle />
      {children}
    </div>
  );
};

export default Layout;
