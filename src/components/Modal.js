import React from 'react';
import { styles } from '../styles';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return React.createElement('div', { 
    style: styles.modalOverlay, 
    onClick: onClose 
  },
    React.createElement('div', { 
      style: styles.modal, 
      onClick: e => e.stopPropagation() 
    },
      React.createElement('div', null,
        React.createElement('h2', { 
          style: { 
            margin: '0 0 20px 0', 
            paddingBottom: '10px', 
            borderBottom: '2px solid #007bff' 
          } 
        }, title),
        React.createElement('button', {
          onClick: onClose,
          style: { 
            float: 'right', 
            background: 'none', 
            border: 'none', 
            fontSize: '1.8rem', 
            cursor: 'pointer' 
          }
        }, '×')
      ),
      children
    )
  );
}