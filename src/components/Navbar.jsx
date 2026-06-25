import { useState, useEffect } from 'react';

const SLIDE_IDS = ['hero', 'tentang', 'keahlian', 'proyek', 'kontak'];
const NAV_ITEMS = ['tentang', 'keahlian', 'proyek', 'kontak'];

function Navbar({ inSlider, onGoSlide }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (inSlider) return; // in slider mode navbar is always on slide 0
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [inSlider]);

  const handleClick = (id) => {
    if (inSlider && onGoSlide) {
      const idx = SLIDE_IDS.indexOf(id);
      if (idx !== -1) onGoSlide(idx);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={scrolled ? 'nav-scrolled' : ''}>
      <div className="logo">
        <span className="logo-bracket">&lt;</span>
        Portfolio
        <span className="logo-bracket">/&gt;</span>
      </div>
      <ul>
        {NAV_ITEMS.map((id, i) => (
          <li key={id}>
            <a onClick={() => handleClick(id)} className="nav-link">
              <span className="nav-num">0{i + 1}.</span>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
