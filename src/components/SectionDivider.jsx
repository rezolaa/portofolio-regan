import { useReveal } from '../hooks/useReveal';

/**
 * Animated circuit-line divider between sections.
 */
function SectionDivider({ label = '' }) {
  const [ref, visible] = useReveal(0.5);

  return (
    <div className={`section-divider ${visible ? 'div-visible' : ''}`} ref={ref}>
      <div className="div-line div-line-left" />
      {label && <span className="div-label">{label}</span>}
      <div className="div-line div-line-right" />
      {/* circuit nodes */}
      <span className="div-node div-node-l" />
      <span className="div-node div-node-r" />
    </div>
  );
}

export default SectionDivider;
