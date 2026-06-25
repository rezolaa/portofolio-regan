import { useEffect, useRef, useState } from 'react';
import profileImg from '../assets/profile.jpg';

const TEXTS = [
  'Microsoft',
  'UI/UX Enthusiast',
  'Data Analysis',
];

/* ── floating badge data ── */
const BADGES = [
  { label: ' Figma / Adobe XD / Canva',      top: '6%',  left: '-18%', delay: '0s'   },
  { label: ' UI/UX',     top: '18%', left: '102%', delay: '0.3s' },
  { label: ' Microsoft',  top: '72%', left: '-20%', delay: '0.6s' },
  { label: ' Data Analysis',top: '82%', left: '90%', delay: '0.9s' },
];

function ProfilePhoto() {
  const wrapRef   = useRef(null);
  const innerRef  = useRef(null);
  const glowRef   = useRef(null);
  const badgeRefs = useRef([]);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const inner = innerRef.current;
    const glow  = glowRef.current;
    if (!wrap || !inner) return;

    let raf;
    let current = { rx: 0, ry: 0 };
    let target  = { rx: 0, ry: 0 };

    /* lerp smooth tilt */
    const animate = () => {
      current.rx += (target.rx - current.rx) * 0.1;
      current.ry += (target.ry - current.ry) * 0.1;
      inner.style.transform =
        `perspective(900px) rotateX(${current.rx}deg) rotateY(${current.ry}deg) scale(1.03)`;
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / rect.height) * 22;
      const ry   = ((e.clientX - cx) / rect.width)  * -22;
      target = { rx, ry };

      /* spotlight glow follows cursor */
      const gx = ((e.clientX - rect.left) / rect.width)  * 100;
      const gy = ((e.clientY - rect.top)  / rect.height) * 100;
      if (glow) {
        glow.style.background =
          `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, transparent 65%)`;
      }

      /* badges repel from cursor */
      badgeRefs.current.forEach((b) => {
        if (!b) return;
        const br  = b.getBoundingClientRect();
        const bcx = br.left + br.width  / 2;
        const bcy = br.top  + br.height / 2;
        const dx  = bcx - e.clientX;
        const dy  = bcy - e.clientY;
        const d   = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          const f  = (140 - d) / 140;
          const tx = dx / d * f * 28;
          const ty = dy / d * f * 28;
          b.style.transform = `translate(${tx}px, ${ty}px) scale(${1 + f * 0.15})`;
        } else {
          b.style.transform = 'translate(0,0) scale(1)';
        }
      });
    };

    const onLeave = () => {
      target = { rx: 0, ry: 0 };
      if (glow) glow.style.background = 'transparent';
      badgeRefs.current.forEach((b) => {
        if (b) b.style.transform = 'translate(0,0) scale(1)';
      });
    };

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="photo-scene" ref={wrapRef}>

      {/* ── ambient glow backdrop ── */}
      <div className="photo-glow-bg" />

      {/* ── spinning gradient ring ── */}
      <div className="photo-ring-gradient" />

      {/* ── dashed orbit rings ── */}
      <div className="photo-orbit photo-orbit-1" />
      <div className="photo-orbit photo-orbit-2" />

      {/* ── HUD corner brackets ── */}
      <span className="hud-corner hud-tl" />
      <span className="hud-corner hud-tr" />
      <span className="hud-corner hud-bl" />
      <span className="hud-corner hud-br" />

      {/* ── floating tech badges ── */}
      {BADGES.map((b, i) => (
        <div
          key={b.label}
          className="photo-badge"
          ref={(el) => (badgeRefs.current[i] = el)}
          style={{ top: b.top, left: b.left, animationDelay: b.delay }}
        >
          {b.label}
        </div>
      ))}

      {/* ── the actual photo card ── */}
      <div className="photo-card" ref={innerRef}>
        {/* scan line overlay */}
        <div className="photo-scanline" />
        {/* spotlight overlay */}
        <div className="photo-spotlight" ref={glowRef} />
        <img src={profileImg} alt="Foto Profil" draggable={false} />

        {/* ── status chip ── */}
        <div className="photo-status">
          <span className="status-dot" />
          Available for work
        </div>
      </div>

      {/* ── floating dots decoration ── */}
      <div className="photo-dots photo-dots-tl" />
      <div className="photo-dots photo-dots-br" />
    </div>
  );
}

function Hero({ onGoSlide }) {
  const [displayed, setDisplayed]   = useState('');
  const [textIdx, setTextIdx]       = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = TEXTS[textIdx];
    let t;
    if (!isDeleting && displayed.length < current.length)
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    else if (!isDeleting && displayed.length === current.length)
      t = setTimeout(() => setIsDeleting(true), 1800);
    else if (isDeleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 45);
    else { setIsDeleting(false); setTextIdx((p) => (p + 1) % TEXTS.length); }
    return () => clearTimeout(t);
  }, [displayed, isDeleting, textIdx]);

  const goProyek  = () => onGoSlide ? onGoSlide(3) : document.getElementById('proyek')?.scrollIntoView({ behavior: 'smooth' });
  const goKontak  = () => onGoSlide ? onGoSlide(4) : document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="hero-content">
      <ProfilePhoto />

      <div className="hero-text">
        <p className="hero-greeting">Halo, Perkenalkan Saya</p>
        <h1>Regan Gradasi Matahari Jingga</h1>
        <div className="typing-wrap">
          <span className="typing-text">{displayed}</span>
          <span className="typing-cursor">|</span>
        </div>
        <p className="hero-desc">
          Mahasiswa vokasi yang tertarik pada bidang teknologi, data analysis, memberikan dan mengembangkan inovasi UI/UX.
        </p>
        <div className="hero-actions">
          <button className="btn btn-glow" onClick={goProyek}>Lihat Portofolio</button>
          <button className="btn btn-outline" onClick={goKontak}>Hubungi Saya</button>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">3+</span><span className="stat-label">Proyek</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">6+</span><span className="stat-label">Keahlian</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">∞</span><span className="stat-label">Semangat</span></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
