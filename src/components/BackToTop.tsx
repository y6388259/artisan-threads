import { useState, useEffect } from 'react';

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '16px',
        zIndex: 50,
        width: '40px',
        height: '40px',
        backgroundColor: '#f97316',
        color: 'white',
        borderRadius: '50%',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}
    >
      ↑
    </button>
  );
};