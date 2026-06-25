import { useEffect, useRef } from 'react';

/**
 * Slide 3 — Keahlian
 * HACKER aesthetic:
 * - Scanline grid overlay
 * - Floating terminal commands streaming across
 * - SSH-style blinking prompts at random positions
 * - Horizontal data streams (like network packets)
 * - Corner HUD readouts ticking
 * NO circles, NO blobs — pure terminal/CLI vibe
 */
function BgBinary({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf, t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── terminal command lines streaming diagonally ── */
    const CMD_POOL = [
      'sudo apt-get install node',
      'git commit -m "feat: add skill"',
      'npm run build --prod',
      'ssh root@192.168.1.1',
      'cat /etc/passwd | grep user',
      'nmap -sV 10.0.0.1',
      'chmod 777 deploy.sh && ./deploy.sh',
      'docker build -t portfolio:latest .',
      'curl -X POST https://api.github.com',
      'webpack --mode production',
      'SELECT * FROM skills WHERE level > 70',
      'git push origin main --force',
      'ping -c 4 google.com',
      'ls -la /var/www/html',
      'tail -f /var/log/nginx/access.log',
      'export NODE_ENV=production',
      'python3 -m http.server 8080',
      'ps aux | grep node | awk "{print $2}"',
      'systemctl restart nginx',
      'grep -r "TODO" ./src --include="*.jsx"',
    ];

    /* floating command lines */
    const streams = Array.from({ length: 22 }, () => ({
      text:   CMD_POOL[Math.floor(Math.random() * CMD_POOL.length)],
      x:      Math.random() * window.innerWidth,
      y:      Math.random() * window.innerHeight,
      vx:     (Math.random() - 0.5) * 0.35,
      vy:     (Math.random() > 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.2),
      alpha:  0.06 + Math.random() * 0.09,
      size:   9 + Math.floor(Math.random() * 5),
      blink:  Math.random() * Math.PI * 2,
      cursor: Math.random() > 0.5, // show blinking cursor at end
    }));

    /* horizontal data-stream bars */
    const BARS = Array.from({ length: 8 }, () => ({
      y:      Math.random() * window.innerHeight,
      x:     -300,
      speed:  0.8 + Math.random() * 1.4,
      len:    80 + Math.random() * 200,
      alpha:  0.07 + Math.random() * 0.08,
      thick:  1,
      data:   Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join(' '),
    }));

    /* corner HUD readouts */
    const HUD_LINES = [
      () => `SYS: ${(40 + Math.sin(t * 0.03) * 8).toFixed(1)}% CPU`,
      () => `MEM: ${(62 + Math.cos(t * 0.02) * 5).toFixed(0)}MB / 256MB`,
      () => `NET: ${(Math.random() * 9.9).toFixed(1)} KB/s ↑  ${(Math.random() * 24).toFixed(1)} KB/s ↓`,
      () => `PKT: ${(t * 3 + 1024).toString(16).toUpperCase()}h`,
      () => `UPTIME: ${String(Math.floor(t / 3600)).padStart(2,'0')}:${String(Math.floor((t % 3600)/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`,
    ];

    /* scanline grid */
    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(17,24,39,0.028)';
      ctx.lineWidth   = 0.5;
      const gapX = 48, gapY = 48;
      for (let x = 0; x < canvas.width;  x += gapX) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gapY) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      // horizontal scanline sweep
      const sweepY = ((t * 1.2) % (canvas.height + 60)) - 30;
      const sg = ctx.createLinearGradient(0, sweepY - 30, 0, sweepY + 30);
      sg.addColorStop(0,   'rgba(17,24,39,0)');
      sg.addColorStop(0.5, 'rgba(17,24,39,0.04)');
      sg.addColorStop(1,   'rgba(17,24,39,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, sweepY - 30, canvas.width, 60);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      drawGrid();

      /* ── horizontal data bar streams ── */
      BARS.forEach((bar) => {
        bar.x += bar.speed;
        if (bar.x > canvas.width + 300) {
          bar.x     = -bar.len - 100;
          bar.y     = Math.random() * canvas.height;
          bar.data  = Array.from({ length: 12 }, () =>
            Math.floor(Math.random() * 256).toString(16).padStart(2,'0')
          ).join(' ');
        }

        // line
        ctx.beginPath();
        ctx.moveTo(bar.x, bar.y);
        ctx.lineTo(bar.x + bar.len, bar.y);
        ctx.strokeStyle = `rgba(17,24,39,${bar.alpha})`;
        ctx.lineWidth   = bar.thick;
        ctx.stroke();

        // leading bright tip
        ctx.beginPath();
        ctx.arc(bar.x + bar.len, bar.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17,24,39,${bar.alpha * 2.5})`;
        ctx.fill();

        // hex data label
        ctx.font = '8px "Courier New"';
        ctx.fillStyle = `rgba(17,24,39,${bar.alpha * 1.2})`;
        ctx.fillText(bar.data, bar.x, bar.y - 4);
      });

      /* ── floating command streams ── */
      ctx.font = '11px "Courier New", monospace';
      streams.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.blink += 0.06;

        if (s.x < -400) s.x = canvas.width  + 50;
        if (s.x > canvas.width  + 400) s.x = -50;
        if (s.y < -20)  s.y = canvas.height + 20;
        if (s.y > canvas.height + 20) s.y = -20;

        ctx.font = `${s.size}px "Courier New", monospace`;
        ctx.fillStyle = `rgba(17,24,39,${s.alpha})`;

        // prompt prefix
        const prefix = '$ ';
        ctx.fillText(prefix + s.text, s.x, s.y);

        // blinking block cursor
        if (s.cursor && Math.sin(s.blink) > 0) {
          const w = ctx.measureText(prefix + s.text).width;
          ctx.fillStyle = `rgba(17,24,39,${s.alpha * 1.8})`;
          ctx.fillRect(s.x + w + 2, s.y - s.size + 2, 7, s.size);
        }
      });

      /* ── corner HUD readouts ── */
      ctx.font = '10px "Courier New", monospace';
      HUD_LINES.forEach((fn, i) => {
        const txt = fn();
        ctx.fillStyle = 'rgba(17,24,39,0.12)';
        // top-left corner
        ctx.fillText(txt, 28, 36 + i * 18);
        // bottom-right corner (mirror)
        const tw = ctx.measureText(txt).width;
        ctx.fillText(txt, canvas.width - tw - 28, canvas.height - 36 - (4 - i) * 18);
      });

      /* ── "ACCESSING..." blinking header ── */
      if (Math.sin(t * 0.04) > 0) {
        ctx.font = 'bold 11px "Courier New"';
        ctx.fillStyle = 'rgba(17,24,39,0.12)';
        ctx.fillText('[ SYSTEM ACTIVE — SKILLS MODULE LOADED ]', 28, canvas.height - 18);
      }

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

export default BgBinary;
