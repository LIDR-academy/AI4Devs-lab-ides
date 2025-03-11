import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, className = '', onClose }) => {
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-steel-blue-50 text-steel-blue-800 border-steel-blue-200',
  };

  const icons = {
    success: <FiCheckCircle className="h-5 w-5 text-green-500" />,
    error: <FiXCircle className="h-5 w-5 text-red-500" />,
    warning: <FiAlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <FiInfo className="h-5 w-5 text-steel-blue-500" />,
  };

  return (
    <div
      className={`${typeClasses[type]} border rounded-md p-4 flex items-start ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{icons[type]}</div>
      <div className="flex-1 pt-0.5">{message}</div>
      {onClose && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <span className="sr-only">Cerrar</span>
          <FiXCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Alert; 