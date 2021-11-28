import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');
const Modal = ({ onClose, children }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    window.removeEventListener('keydown', handleKeyDown);
    onClose();
  };

  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      handleClose();
    }
  };

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      handleClose();
    }
  };

  return createPortal(
    <div className={s.Overlay} onClick={handleBackdropClick}>
      <div className={s.Modal}>{children}</div>
    </div>,
    modalRoot,
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export { Modal };
