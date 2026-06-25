import { useEffect, useRef } from 'react';

/**
 * Slide 2 — Tentang
 * Full-screen matrix rain: dark columns of falling katakana + code chars.
 * Canvas is FIXED to fill entire viewport (behind everything).
 */
function BgMatrix({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01</>{};#@$%&*ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const FS = 15;
    const buildCols = () => Math.floor(canvas.width / FS);
    let drops = Array.from({ length: buildCols() }, () => Math.random() * -60);

    const draw = () => {
      // semi-transparent fade
      ctx.fillStyle = 'rgba(244,246,249,0.10)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = buildCols();
      if (drops.length !== cols) drops = Array.from({ length: cols }, () => Math.random() * -60);

      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];

        // Head of stream — brighter
        const isHead = Math.random() > 0.96;
        ctx.font = `${FS}px "Courier New", monospace`;
        ctx.fillStyle = isHead
          ? 'rgba(17,24,39,0.55)'
          : `rgba(17,24,39,${0.12 + Math.random() * 0.14})`;
        ctx.fillText(ch, i * FS, y * FS);

        if (y * FS > canvas.height && Math.random() > 0.97) drops[i] = 0;
        drops[i] += 0.6;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    />
  );
}

export default BgMatrix;
