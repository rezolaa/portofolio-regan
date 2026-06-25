import { useEffect, useRef } from 'react';

/**
 * Slide 4 — Proyek
 * Full-screen glowing circuit board:
 * - Grid of horizontal/vertical traces that light up and travel
 * - Bright travelling pulse dots
 * - Corner solder-point nodes
 */
function BgCircuit({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const GRID = 60;

    function makePath() {
      const pts = [];
      let x = Math.floor(Math.random() * Math.ceil(canvas.width  / GRID)) * GRID;
      let y = Math.floor(Math.random() * Math.ceil(canvas.height / GRID)) * GRID;
      const steps = 6 + Math.floor(Math.random() * 10);
      for (let i = 0; i < steps; i++) {
        pts.push({ x, y });
        const dir = Math.floor(Math.random() * 4);
        const len = (1 + Math.floor(Math.random() * 4)) * GRID;
        if      (dir === 0) x = Math.min(canvas.width,  x + len);
        else if (dir === 1) x = Math.max(0,              x - len);
        else if (dir === 2) y = Math.min(canvas.height, y + len);
        else                y = Math.max(0,              y - len);
      }
      return pts;
    }

    class Trace {
      constructor() {
        this.pts      = makePath();
        this.draw_pct = 0;          // 0→1: how much of path is drawn
        this.pulse    = 0;          // 0→1: traveller dot position
        this.speed    = 0.003 + Math.random() * 0.005;
        this.lineAlpha = 0.13 + Math.random() * 0.10;
        this.pulseAlpha = 0.45 + Math.random() * 0.3;
        this.lineW    = 1 + Math.random() * 1.5;
      }

      draw() {
        if (this.pts.length < 2) return;
        const seg = this.pts.length - 1;
        const drawn = Math.max(1, Math.floor(this.draw_pct * seg));

        /* trace line */
        ctx.beginPath();
        ctx.moveTo(this.pts[0].x, this.pts[0].y);
        for (let i = 1; i <= drawn; i++) ctx.lineTo(this.pts[i].x, this.pts[i].y);
        ctx.strokeStyle = `rgba(17,24,39,${this.lineAlpha})`;
        ctx.lineWidth   = this.lineW;
        ctx.setLineDash([]);
        ctx.stroke();

        /* solder nodes */
        for (let i = 0; i <= drawn; i++) {
          ctx.beginPath();
          ctx.arc(this.pts[i].x, this.pts[i].y, this.lineW * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(17,24,39,${this.lineAlpha * 1.8})`;
          ctx.fill();
        }

        /* travelling bright dot */
        const si  = Math.min(Math.floor(this.pulse * seg), seg - 1);
        const frac = (this.pulse * seg) - si;
        const px  = this.pts[si].x + (this.pts[si+1].x - this.pts[si].x) * frac;
        const py  = this.pts[si].y + (this.pts[si+1].y - this.pts[si].y) * frac;

        ctx.beginPath();
        ctx.arc(px, py, this.lineW * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17,24,39,${this.pulseAlpha})`;
        ctx.fill();

        // glow halo
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 12);
        grd.addColorStop(0, `rgba(17,24,39,${this.pulseAlpha * 0.4})`);
        grd.addColorStop(1, 'rgba(17,24,39,0)');
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        this.draw_pct = Math.min(this.draw_pct + this.speed, 1);
        this.pulse    = (this.pulse + this.speed * 1.2) % 1;
      }

      isDone() { return this.draw_pct >= 1; }
    }

    let traces = Array.from({ length: 16 }, () => new Trace());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* faint grid dots */
      for (let x = 0; x <= canvas.width;  x += GRID) {
        for (let y = 0; y <= canvas.height; y += GRID) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(17,24,39,0.06)';
          ctx.fill();
        }
      }

      traces.forEach((tr, i) => {
        if (tr.isDone()) traces[i] = new Trace();
        tr.draw();
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

export default BgCircuit;
