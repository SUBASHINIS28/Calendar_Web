import React, { useEffect, useState } from 'react';
import '../styles/notification.css';

const ErrorNotification = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) {
        setTimeout(onDismiss, 300); // Call onDismiss after exit animation
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  return (
    <div className={`error-notification ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="error-content">
        <span className="error-message">{message}</span>
        <button 
          className="error-dismiss"
          onClick={() => {
            setIsVisible(false);
            if (onDismiss) {
              setTimeout(onDismiss, 300);
            }
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;