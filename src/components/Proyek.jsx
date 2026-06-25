import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const projects = [
  { id:1, title:'FrontEnd Amour Hijab', desc:'Website e-commerce modern untuk penjualan hijab, dirancang dengan tampilan yang bersih, estetis, dan responsif.', tags:['React','E-Commerce','CSS'], icon:'🧕', status:'Completed', link: 'https://github.com/rezolaa/AmourHijab' },
  { id:2, title:'UI / UX Kampung Tematik', desc:'Perancangan pengalaman dan antarmuka pengguna untuk website budaya interaktif sebagai media pengenalan keunikan kampung tematik.', tags:['UI/UX','Figma','Culture'], icon:'🏡', status:'Completed', link: 'https://github.com/rezolaa/kampung-tematik' },
  { id:3, title:'FrontEnd Website Synable AI', desc:'Website penerjemah Bahasa Isyarat Indonesia (Bisindo) bertenaga AI untuk mendukung komunikasi inklusif bagi semua kalangan.', tags:['React','AI','Inklusi'], icon:'🤟', status:'Completed', link: 'https://github.com/rezolaa/website-sysnable-ai' },
];

function ProjectCard({ project, cardVisible }) {
  const cardRef = useRef(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * 10;
      const ry = ((e.clientX - r.left - r.width  / 2) / r.width)  * -10;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      card.style.boxShadow = '0 24px 50px rgba(17,24,39,0.15)';
    };
    const onLeave = () => { card.style.transform = ''; card.style.boxShadow = ''; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <div className={`project-card reveal-flip ${cardVisible ? 'flip-visible' : ''}`} ref={cardRef}>
      <div className="project-header">
        <span className="project-icon">{project.icon}</span>
        <span className={`project-status ${project.status === 'Completed' ? 'status-done' : 'status-wip'}`}>{project.status}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.desc}</p>
      <div className="project-tags">
        {project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
      </div>
      <div className="project-footer">
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
          View Details →
        </a>
      </div>
    </div>
  );
}

function Proyek({ forceVisible }) {
  const [ref, observed] = useReveal(0.15);
  const visible = forceVisible !== undefined ? forceVisible : observed;
  const [cardsVisible, setCardsVisible] = useState([]);
  const triggered = useRef(false);

  useEffect(() => {
    if (!visible || triggered.current) return;
    triggered.current = true;
    projects.forEach((_, i) => setTimeout(() => setCardsVisible((p) => [...p, i]), 200 + i * 180));
  }, [visible]);

  return (
    <section
      id="proyek"
      className={`card card-hover reveal-section reveal-from-right ${visible ? 'reveal-visible' : ''}`}
      ref={ref}
    >
      <div className={`card-sweep ${visible ? 'sweep-run' : ''}`} />
      <div className="card-tech-label">projects.ts</div>
      <h2 className={`reveal-child ${visible ? 'child-visible' : ''}`} style={{ '--delay': '0.1s' }}>Proyek</h2>
      <div className="projects-grid">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} cardVisible={cardsVisible.includes(i)} />
        ))}
      </div>
    </section>
  );
}

export default Proyek;
