import { useEffect, useRef } from 'react';

/**
 * Slide 5 — Kontak
 * Deep-space neural mesh:
 * - Many nodes that drift and pulse
 * - Edges glow brighter when nodes are close
 * - Signal "packets" travel along edges
 * - Occasional node burst ripple
 */
function BgNetwork({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf, t = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const N = 55;
    const CONNECT_DIST = 160;

    const nodes = Array.from({ length: N }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.55,
      vy:    (Math.random() - 0.5) * 0.55,
      r:     1.5 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      burst: 0, // ripple timer
    }));

    /* signal packets travelling between node pairs */
    const packets = [];

    const spawnPacket = () => {
      const a = Math.floor(Math.random() * N);
      let   b = Math.floor(Math.random() * N);
      while (b === a) b = Math.floor(Math.random() * N);
      packets.push({ a, b, t: 0, speed: 0.008 + Math.random() * 0.012 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      /* move nodes */
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        n.phase += 0.018;
        if (n.burst > 0) n.burst -= 0.03;
      });

      /* spawn packets occasionally */
      if (t % 40 === 0 && packets.length < 20) spawnPacket();

      /* ── edges ── */
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < CONNECT_DIST) {
            const a = (1 - d / CONNECT_DIST);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(17,24,39,${a * 0.18})`;
            ctx.lineWidth = a * 1.2;
            ctx.stroke();
          }
        }
      }

      /* ── packets ── */
      for (let k = packets.length - 1; k >= 0; k--) {
        const pk = packets[k];
        pk.t += pk.speed;
        if (pk.t >= 1) {
          nodes[pk.b].burst = 1; // trigger ripple at destination
          packets.splice(k, 1);
          continue;
        }
        const ax = nodes[pk.a].x, ay = nodes[pk.a].y;
        const bx = nodes[pk.b].x, by = nodes[pk.b].y;
        const px = ax + (bx - ax) * pk.t;
        const py = ay + (by - ay) * pk.t;

        // bright travelling dot
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 10);
        grd.addColorStop(0, 'rgba(17,24,39,0.65)');
        grd.addColorStop(1, 'rgba(17,24,39,0)');
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(17,24,39,0.7)';
        ctx.fill();
      }

      /* ── nodes ── */
      nodes.forEach((n) => {
        const pulse = Math.sin(n.phase) * 0.5 + 0.5;
        const r = n.r + pulse * 1.5;

        // core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17,24,39,${0.18 + pulse * 0.18})`;
        ctx.fill();

        // halo
        const haloR = r + 5 + pulse * 6;
        const grd2 = ctx.createRadialGradient(n.x, n.y, r, n.x, n.y, haloR);
        grd2.addColorStop(0, `rgba(17,24,39,${0.08 * pulse})`);
        grd2.addColorStop(1, 'rgba(17,24,39,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = grd2;
        ctx.fill();

        // burst ripple
        if (n.burst > 0) {
          const br = (1 - n.burst) * 40;
          ctx.beginPath();
          ctx.arc(n.x, n.y, br, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(17,24,39,${n.burst * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
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
        pointerEvents: 'none', zIndex: 0,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    />
  );
}

export default BgNetwork;
