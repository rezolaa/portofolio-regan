import { useReveal } from '../hooks/useReveal';

function Footer() {
  const [ref, visible] = useReveal(0.3);

  return (
    <footer ref={ref} className={`footer-reveal ${visible ? 'footer-visible' : ''}`}>
      <div className="footer-scan" />
      <div className="footer-inner">
        <span className="footer-logo">&lt;Rezola /&gt;</span>
        <p>© 2026 Regan Portfolio. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
