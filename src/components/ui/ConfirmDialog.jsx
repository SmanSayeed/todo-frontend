import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };
  
  const footer = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      
      <Button
        variant={confirmVariant}
        onClick={handleConfirm}
        loading={isLoading}
      >
        {confirmText}
      </Button>
    </div>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
      closeOnOverlayClick={!isLoading}
    >
      <p className="text-gray-700">
        {message}
      </p>
    </Modal>
  );
};

export default ConfirmDialog;