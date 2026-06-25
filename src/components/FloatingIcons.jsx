import { useEffect, useRef } from 'react';

const ICONS = [
  { label: '</>', x: '8%', y: '20%', size: '2.2rem', delay: '0s' },
  { label: '{}', x: '85%', y: '15%', size: '2rem', delay: '0.4s' },
  { label: '01', x: '75%', y: '70%', size: '1.6rem', delay: '0.8s' },
  { label: '#', x: '15%', y: '75%', size: '2.5rem', delay: '0.2s' },
  { label: '</>',x: '50%', y: '85%', size: '1.8rem', delay: '1s' },
  { label: '⚡', x: '90%', y: '45%', size: '2rem', delay: '0.6s' },
  { label: '∑', x: '5%', y: '50%', size: '2.2rem', delay: '1.2s' },
  { label: '⬡', x: '60%', y: '10%', size: '2rem', delay: '0.3s' },
];

function FloatingIcons() {
  const refs = useRef([]);

  useEffect(() => {
    const items = refs.current;
    const handlers = items.map((el, i) => {
      if (!el) return null;
      const handler = (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const force = (160 - dist) / 160;
          const mx = -dx * force * 0.5;
          const my = -dy * force * 0.5;
          el.style.transform = `translate(${mx}px, ${my}px) scale(${1 + force * 0.3})`;
        } else {
          el.style.transform = 'translate(0,0) scale(1)';
        }
      };
      window.addEventListener('mousemove', handler);
      return handler;
    });

    return () => {
      items.forEach((el, i) => {
        if (handlers[i]) window.removeEventListener('mousemove', handlers[i]);
      });
    };
  }, []);

  return (
    <>
      {ICONS.map((icon, i) => (
        <div
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="floating-icon"
          style={{
            left: icon.x,
            top: icon.y,
            fontSize: icon.size,
            animationDelay: icon.delay,
          }}
        >
          {icon.label}
        </div>
      ))}
    </>
  );
}

export default FloatingIcons;
