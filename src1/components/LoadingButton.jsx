import React from 'react';
import '../styles/LoadingButton.css';

const LoadingButton = ({ loading, onClick, children, className = '' }) => {
  const handleClick = async (e) => {
    if (!loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      className={`loading-button ${loading ? 'loading' : ''} ${className}`}
      onClick={handleClick}
      disabled={loading}
    >
      <div className="spinner" />
      <span>{children}</span>
    </button>
  );
};

export default LoadingButton;
