import React, { createContext, useContext, ReactNode } from 'react';
import { toast, ToastOptions } from 'react-toastify';

// Definir la interfaz para las notificaciones
interface NotificationContextType {
  notifySuccess: (message: string, options?: ToastOptions) => void;
  notifyError: (message: string, options?: ToastOptions) => void;
  notifyInfo: (message: string, options?: ToastOptions) => void;
  notifyWarning: (message: string, options?: ToastOptions) => void;
}

// Crear el contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Opciones por defecto para las notificaciones
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000, // Reducir el tiempo de mostrado a 3 segundos
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Proveedor del contexto
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Funciones para mostrar diferentes tipos de notificaciones
  const notifySuccess = (message: string, options?: ToastOptions) => {
    // Asegurarnos de que no hay toasts duplicados con el mismo mensaje
    toast.dismiss(); // Cerrar notificaciones previas
    toast.success(message, { ...defaultOptions, ...options });
  };

  const notifyError = (message: string, options?: ToastOptions) => {
    toast.dismiss(); // Cerrar notificaciones previas
    toast.error(message, { ...defaultOptions, ...options });
  };

  const notifyInfo = (message: string, options?: ToastOptions) => {
    toast.dismiss(); // Cerrar notificaciones previas
    toast.info(message, { ...defaultOptions, ...options });
  };

  const notifyWarning = (message: string, options?: ToastOptions) => {
    toast.dismiss(); // Cerrar notificaciones previas
    toast.warning(message, { ...defaultOptions, ...options });
  };

  // Valor del contexto
  const contextValue: NotificationContextType = {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  return context;
}; 