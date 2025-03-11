import { useState, useEffect } from "react";

/**
 * Componente para mostrar notificaciones temporales al usuario
 */
export const Notification = ({ type, message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Efecto para cerrar la notificación automáticamente después de un tiempo
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Cierra la notificación con animación
  const handleClose = () => {
    setIsVisible(false);

    // Espera a que termine la animación antes de llamar al callback
    setTimeout(() => {
      onClose && onClose();
    }, 300); // Duración de la animación
  };

  // Determina las clases CSS según el tipo de notificación
  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "notification--success";
      case "error":
        return "notification--error";
      case "warning":
        return "notification--warning";
      case "info":
        return "notification--info";
      default:
        return "";
    }
  };

  // Determina el icono según el tipo de notificación
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "";
    }
  };

  return (
    <div
      className={`notification ${getTypeClasses()} ${
        isVisible ? "notification--visible" : "notification--hidden"
      }`}
      role="alert"
      aria-live="assertive">
      <div className="notification__icon">{getIcon()}</div>
      <div className="notification__content">{message}</div>
      <button
        type="button"
        className="notification__close"
        onClick={handleClose}
        aria-label="Cerrar notificación">
        &times;
      </button>
    </div>
  );
};

export default Notification;
