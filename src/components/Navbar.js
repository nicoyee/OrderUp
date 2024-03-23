import React, { useState, useEffect } from 'react';

function ScrollProgressBar() {
  const [scroll, setScroll] = useState(0);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const scrollPercent = scrollTop / scrollHeight * 100;
    setScroll(scrollPercent);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [window]); // Add 'window' as dependency

  return (
    <div className="navbar">
      <div className="scroll-progress-bar" style={{ height: `${scroll}%` }} />
    </div>
  );
}

export default ScrollProgressBar;