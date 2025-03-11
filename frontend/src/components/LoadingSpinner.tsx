import React from "react";

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full ${className}`}
    />
  );
};

export default LoadingSpinner;
