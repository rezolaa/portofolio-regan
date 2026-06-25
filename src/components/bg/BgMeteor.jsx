import { useEffect, useRef } from 'react';

/** Slide 1 — Hero: shooting meteors + star field */
function BgMeteor({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* stars */
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      twinkle: Math.random() * 0.02 + 0.005,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));

    /* meteors */
    class Meteor {
      constructor() { this.reset(); }
      reset() {
        this.x     = Math.random() * canvas.width * 1.5;
        this.y     = -20;
        this.len   = Math.random() * 160 + 80;
        this.speed = Math.random() * 6 + 4;
        this.alpha = Math.random() * 0.6 + 0.3;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
        this.width = Math.random() * 1.5 + 0.5;
        this.alive = true;
      }
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.y > canvas.height + 50 || this.x > canvas.width + 50) {
          this.alive = false;
        }
      }
      draw() {
        const tx = this.x - Math.cos(this.angle) * this.len;
        const ty = this.y - Math.sin(this.angle) * this.len;
        const grad = ctx.createLinearGradient(tx, ty, this.x, this.y);
        grad.addColorStop(0, `rgba(17,24,39,0)`);
        grad.addColorStop(1, `rgba(17,24,39,${this.alpha})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.width;
        ctx.stroke();
      }
    }

    const meteors = [];
    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* twinkle stars */
      stars.forEach((s) => {
        s.alpha += s.twinkle * s.dir;
        if (s.alpha > 0.6 || s.alpha < 0.05) s.dir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17,24,39,${s.alpha})`;
        ctx.fill();
      });

      /* spawn meteor */
      tick++;
      if (tick % 38 === 0) meteors.push(new Meteor());

      /* update & draw meteors */
      for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].update();
        meteors[i].draw();
        if (!meteors[i].alive) meteors.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    />
  );
}

export default BgMeteor;
