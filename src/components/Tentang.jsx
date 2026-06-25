import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const TERMINAL_LINES = [
  '> Nama: Regan Gradasi Matahari Jingga',
  '> Status: Mahasiswa Aktif',
  '> Fokus: UI/UX Enthusiast & Data Analyst',
  '> Mode: Building something great...',
  '> $ _',
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

function GlitchText({ text, trigger, delay = 0 }) {
  const [output, setOutput] = useState(() => text.replace(/\S/g, '_'));
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const totalFrames = 18;
    const t = setTimeout(() => {
      const id = setInterval(() => {
        frame++;
        setOutput(text.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          return i / text.length < frame / totalFrames
            ? ch
            : CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(''));
        if (frame >= totalFrames) clearInterval(id);
      }, 40);
    }, delay);
    return () => clearTimeout(t);
  }, [trigger]);
  return <span className="glitch-text">{output}</span>;
}

function Tentang({ forceVisible }) {
  const [ref, observed] = useReveal(0.2);
  const visible = forceVisible !== undefined ? forceVisible : observed;
  const [lines, setLines] = useState([]);
  const termStarted = useRef(false);

  useEffect(() => {
    if (!visible || termStarted.current) return;
    termStarted.current = true;
    TERMINAL_LINES.forEach((line, i) =>
      setTimeout(() => setLines((p) => [...p, line]), 400 + i * 500)
    );
  }, [visible]);

  return (
    <section
      id="tentang"
      className={`card card-hover reveal-section reveal-from-left ${visible ? 'reveal-visible' : ''}`}
      ref={ref}
    >
      <div className={`card-sweep ${visible ? 'sweep-run' : ''}`} />
      <div className="card-tech-label">about.exe</div>
      <h2><GlitchText text="Tentang Saya" trigger={visible} delay={200} /></h2>
      <div className="about-wrap">
        <p className={`about-text reveal-child ${visible ? 'child-visible' : ''}`} style={{ '--delay': '0.3s' }}>
          Saya adalah mahasiswa yang memiliki minat pada pengembangan website,
          teknologi digital, dan penerapan inovasi untuk menyelesaikan berbagai
          permasalahan secara kreatif. Informasi pribadi dibuat anonim dan dapat
          diubah sesuai kebutuhan.
        </p>
        <div className={`terminal-box reveal-child ${visible ? 'child-visible' : ''}`} style={{ '--delay': '0.5s' }}>
          <div className="terminal-header">
            <span className="t-dot t-red" /><span className="t-dot t-yellow" /><span className="t-dot t-green" />
            <span className="t-title">bash ~ profile</span>
          </div>
          <div className="terminal-body">
            {lines.map((line, i) => <div key={i} className="terminal-line">{line}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Tentang;
