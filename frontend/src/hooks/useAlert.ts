import { useState } from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface UseAlertReturn {
  showAlert: boolean;
  alertMessage: string;
  alertType: AlertType;
  displayAlert: (message: string, type: AlertType) => void;
  hideAlert: () => void;
}

export const useAlert = (): UseAlertReturn => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<AlertType>('info');

  const displayAlert = (message: string, type: AlertType) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  return {
    showAlert,
    alertMessage,
    alertType,
    displayAlert,
    hideAlert,
  };
}; 