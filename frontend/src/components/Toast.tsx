import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const colors = {
    success: 'var(--success-color)',
    error: 'var(--danger-color)',
    warning: 'var(--warning-color)',
    info: 'var(--primary-color)'
  };

  return (
    <div
      className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}
      style={{
        '--toast-color': colors[type]
      } as React.CSSProperties}
    >
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button 
        className="toast-close"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose?.();
          }, 300);
        }}
      >
        ✕
      </button>
    </div>
  );
}
