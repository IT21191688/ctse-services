import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/uiSlice';

/**
 * Modal component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {Function} [props.onClose] - Close handler
 * @param {boolean} [props.hideCloseButton=false] - Whether to hide the close button
 * @param {string} [props.size='md'] - Modal size (sm, md, lg, xl, full)
 * @param {boolean} [props.disableOverlayClose=false] - Whether to disable closing when clicking the overlay
 * @param {React.ReactNode} [props.footer] - Optional footer content
 */
const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  hideCloseButton = false,
  size = 'md',
  disableOverlayClose = false,
  footer,
}) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  
  // Handle close action
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      dispatch(closeModal());
    }
  };
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleClose]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (disableOverlayClose) return;
    
    // Close only if clicking outside modal content
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  // Don't render if not open
  if (!isOpen) return null;
  
  // Get the modal root element (or create if it doesn't exist)
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }
  
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full m-4`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-800">
              {title}
            </h3>
            {!hideCloseButton && (
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={handleClose}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    modalRoot
  );
};

/**
 * Confirmation Modal component
 */
export const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonType = 'danger',
}) => {
  const dispatch = useDispatch();
  
  // Handle close
  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      dispatch(closeModal());
    }
  };
  
  // Handle confirm
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    dispatch(closeModal());
  };
  
  // Button types
  const buttonTypes = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const footer = (
    <div className="flex justify-end space-x-2">
      <button
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
        onClick={handleClose}
      >
        {cancelText}
      </button>
      <button
        className={`px-4 py-2 rounded-md transition-colors ${buttonTypes[confirmButtonType]}`}
        onClick={handleConfirm}
      >
        {confirmText}
      </button>
    </div>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={handleClose}
      size="sm"
      footer={footer}
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
};

export const LoginModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Login"
      onClose={onClose}
      size="md"
    >
      {/* Login form content will be defined separately */}
      <div>Login form will be rendered here</div>
    </Modal>
  );
};

export const RegisterModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Create an Account"
      onClose={onClose}
      size="md"
    >
      {/* Register form content will be defined separately */}
      <div>Registration form will be rendered here</div>
    </Modal>
  );
};

export default Modal;