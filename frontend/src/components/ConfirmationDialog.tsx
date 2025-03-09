import React from 'react';
import Modal from './Modal';
import './ConfirmationDialog.css';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const footer = (
    <>
      <button 
        className="button button-secondary" 
        onClick={onCancel}
        data-testid="cancel-button"
      >
        {cancelText}
      </button>
      <button 
        className="button button-primary" 
        onClick={onConfirm}
        data-testid="confirm-button"
      >
        {confirmText}
      </button>
    </>
  );

  return (
    <div data-testid="confirmation-dialog">
      <Modal
        isOpen={isOpen}
        onClose={onCancel}
        title={title}
        footer={footer}
        className="confirmation-dialog"
      >
        <p className="confirmation-message">{message}</p>
      </Modal>
    </div>
  );
};

export default ConfirmationDialog; 