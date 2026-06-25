import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const skills = [
  { name: 'HTML & CSS',       level: 85, icon: '🌐', description: 'Saya sangat senang belajar untuk mengasah skill saya di HTML/CSS dan membangun web responsif.' },
  { name: 'Laravel',       level: 80, icon: '⚙️', description: 'Mengembangkan backend aplikasi web yang terstruktur dengan framework Laravel.' },
  { name: 'UI/UX Design',     level: 90, icon: '🎨', description: 'Merancang antarmuka pengguna yang menarik, fungsional, dan mudah digunakan.' },
  { name: 'Microsoft Office', level: 100, icon: '💼', description: 'Menguasai produktivitas kantor dengan Word, PowerPoint, dan analisis Excel.' },
  { name: 'Data Analysis',  level: 85, icon: '📊', description: 'Menganalisis data mentah untuk menghasilkan keputusan bisnis yang tepat.' },
  { name: 'Problem Solving',  level: 90, icon: '💡', description: 'Menemukan solusi efektif dan logis untuk memecahkan berbagai tantangan pemecahan masalah.' },
];

function SkillCard({ skill, barAnimate, cardVisible }) {
  const cardRef = useRef(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * 12;
      const ry = ((e.clientX - r.left - r.width  / 2) / r.width)  * -12;
      card.style.transform = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      card.style.boxShadow = '0 16px 40px rgba(17,24,39,0.15)';
    };
    const onLeave = () => { card.style.transform = ''; card.style.boxShadow = ''; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <div className={`skill-card reveal-pop ${cardVisible ? 'pop-visible' : ''}`} ref={cardRef}>
      <div className="skill-top">
        <span className="skill-icon">{skill.icon}</span>
        <span className="skill-name">{skill.name}</span>
        <span className="skill-pct">{skill.level}%</span>
      </div>
      {skill.description && <p className="skill-desc">{skill.description}</p>}
      <div className="skill-bar-bg">
        <div className="skill-bar-fill" style={{ width: barAnimate ? `${skill.level}%` : '0%' }} />
      </div>
    </div>
  );
}

function Keahlian({ forceVisible }) {
  const [ref, observed] = useReveal(0.15);
  const visible = forceVisible !== undefined ? forceVisible : observed;
  const [barAnimate, setBarAnimate] = useState(false);
  const [cardVisible, setCardVisible] = useState([]);
  const triggered = useRef(false);

  useEffect(() => {
    if (!visible || triggered.current) return;
    triggered.current = true;
    skills.forEach((_, i) => setTimeout(() => setCardVisible((p) => [...p, i]), 150 + i * 120));
    setTimeout(() => setBarAnimate(true), 150 + skills.length * 120 + 100);
  }, [visible]);

  return (
    <section
      id="keahlian"
      className={`card card-hover reveal-section reveal-from-bottom ${visible ? 'reveal-visible' : ''}`}
      ref={ref}
    >
      <div className={`card-sweep ${visible ? 'sweep-run' : ''}`} />
      <div className="card-tech-label">skills.json</div>
      <h2 className={`reveal-child ${visible ? 'child-visible' : ''}`} style={{ '--delay': '0.1s' }}>Keahlian</h2>
      <div className="skills-grid">
        {skills.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} barAnimate={barAnimate} cardVisible={cardVisible.includes(i)} />
        ))}
      </div>
    </section>
  );
}

export default Keahlian;
