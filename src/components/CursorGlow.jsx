import { useEffect, useRef } from 'react';

function CursorGlow() {
  const glowRef = useRef(null);
  const trailRef = useRef([]);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const glow = glowRef.current;

    const move = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';

      // spawn trail dot
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 600);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return <div className="cursor-glow" ref={glowRef} />;
}

export default CursorGlow;
