import { useState, useEffect, useRef, useCallback } from 'react';

const SLIDE_ICONS = ['⌂', '◉', '◈', '◆', '✉'];

function FullpageSlider({ slides, labels }) {
  const [current,   setCurrent]   = useState(0);
  const [prev,      setPrev]      = useState(null);
  const [dir,       setDir]       = useState(1);
  const [animating, setAnimating] = useState(false);
  const [flash,     setFlash]     = useState(false);
  const lockRef = useRef(false);
  const touchY  = useRef(null);
  const total   = slides.length;

  const goTo = useCallback((next) => {
    if (lockRef.current || next === current || next < 0 || next >= total) return;
    lockRef.current = true;
    setAnimating(true);
    setFlash(true);
    setDir(next > current ? 1 : -1);
    setPrev(current);
    setCurrent(next);
    setTimeout(() => setFlash(false), 300);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
      lockRef.current = false;
    }, 750);
  }, [current, total]);

  const goNext = useCallback(() => goTo(current + 1), [goTo, current]);
  const goPrev = useCallback(() => goTo(current - 1), [goTo, current]);

  /* wheel */
  useEffect(() => {
    let acc = 0;
    const onWheel = (e) => {
      // Find if we are scrolling inside a scrollable container
      let el = e.target;
      let scrollEl = null;
      while (el && el !== document.body) {
        if (el.classList && (el.classList.contains('card-scroll-area') || el.classList.contains('slide-inner'))) {
          scrollEl = el;
          break;
        }
        el = el.parentElement;
      }

      if (scrollEl) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        const isScrollable = scrollHeight > clientHeight + 5;
        if (isScrollable) {
          // If scrolling down and not at bottom, or scrolling up and not at top, allow inner scroll
          if (e.deltaY > 0 && scrollTop + clientHeight < scrollHeight - 10) return;
          if (e.deltaY < 0 && scrollTop > 5) return;
        }
      }

      e.preventDefault();
      acc += e.deltaY;
      if (Math.abs(acc) > 60) { acc > 0 ? goNext() : goPrev(); acc = 0; }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [goNext, goPrev]);

  /* touch — only navigate when content is at scroll boundary */
  useEffect(() => {
    const startRef = { y: null, scrollTop: 0, innerEl: null };

    const onStart = (e) => {
      const y = e.touches[0].clientY;
      // Walk up the DOM to find the nearest scrollable container
      let el = e.target;
      let scrollEl = null;
      while (el && el !== document.body) {
        if (el.classList && (el.classList.contains('card-scroll-area') || el.classList.contains('slide-inner'))) {
          scrollEl = el;
          break;
        }
        el = el.parentElement;
      }
      startRef.y        = y;
      startRef.scrollTop = scrollEl ? scrollEl.scrollTop : 0;
      startRef.innerEl   = scrollEl;
    };

    const onEnd = (e) => {
      if (startRef.y === null) return;
      const dy = startRef.y - e.changedTouches[0].clientY;

      if (startRef.innerEl) {
        const { scrollTop, scrollHeight, clientHeight } = startRef.innerEl;
        const isScrollable = scrollHeight > clientHeight + 5;

        if (isScrollable) {
          // Swipe up → next slide, but only if content is already at the bottom
          if (dy > 50 && scrollTop + clientHeight < scrollHeight - 10) return;
          // Swipe down → prev slide, but only if content is already at the top
          if (dy < -50 && scrollTop > 5) return;
        }
      }

      if (Math.abs(dy) > 50) { dy > 0 ? goNext() : goPrev(); }
      startRef.y = null;
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend',   onEnd);
    };
  }, [goNext, goPrev]);

  /* keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goNext();
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const getClass = (idx) => {
    if (idx === current) return dir === 1 ? 'slide slide-enter-right' : 'slide slide-enter-left';
    if (idx === prev)    return dir === 1 ? 'slide slide-exit-left'   : 'slide slide-exit-right';
    return 'slide slide-hidden';
  };

  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="fp-root">

      {/* ── slides ── */}
      {slides.map((Slide, i) => (
        <div key={i} className={getClass(i)}>
          <div className="slide-noise" />
          <span className="s-hud s-hud-tl" />
          <span className="s-hud s-hud-tr" />
          <span className="s-hud s-hud-bl" />
          <span className="s-hud s-hud-br" />
          <div className="slide-num">
            <span className="sn-current">0{i + 1}</span>
            <span className="sn-sep">/</span>
            <span className="sn-total">0{total}</span>
          </div>
          <div className="slide-inner">
            <Slide active={i === current} onGoSlide={goTo} />
          </div>
        </div>
      ))}

      {/* ── flash overlay ── */}
      {flash && <div className={`fp-flash fp-flash-${dir === 1 ? 'right' : 'left'}`} />}

      {/* ── top progress bar (animates on transition) ── */}
      {animating && (
        <div className="fp-topbar">
          <div className={`fp-topbar-fill fp-topbar-${dir === 1 ? 'fwd' : 'bwd'}`} />
        </div>
      )}

      {/* ══════════════════════════════════════
          DOT NAV — redesigned
      ══════════════════════════════════════ */}
      <nav className="fp-dots">
        {/* UP arrow */}
        <button
          className={`fp-nav-arrow fp-nav-up ${current === 0 ? 'fp-nav-disabled' : ''}`}
          onClick={goPrev}
          title="Previous"
        >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 14L4 8h12L10 14z" fill="none" stroke="currentColor" strokeWidth="1.5"
                  strokeLinejoin="round" transform="rotate(180,10,11)" />
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>

        {/* dots */}
        <div className="fp-dots-list">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`fp-dot2 ${i === current ? 'fp-dot2-active' : ''}`}
              onClick={() => goTo(i)}
              title={labels?.[i]}
            >
              {/* outer ring */}
              <span className="fp-dot2-ring" />
              {/* inner fill */}
              <span className="fp-dot2-fill" />
              {/* tooltip */}
              <span className="fp-dot2-tip">
                <span className="fp-dot2-tip-icon">{SLIDE_ICONS[i]}</span>
                {labels?.[i]}
              </span>
            </button>
          ))}
        </div>

        {/* DOWN arrow */}
        <button
          className={`fp-nav-arrow fp-nav-down ${current === total - 1 ? 'fp-nav-disabled' : ''}`}
          onClick={goNext}
          title="Next"
        >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 14L4 8h12L10 14z" fill="none" stroke="currentColor" strokeWidth="1.5"
                  strokeLinejoin="round" />
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </nav>

      {/* ══════════════════════════════════════
          LEFT PROGRESS COLUMN
      ══════════════════════════════════════ */}
      <div className="fp-sidebar">
        {/* vertical progress track */}
        <div className="fp-track">
          <div className="fp-track-fill" style={{ height: `${pct}%` }} />
          {/* tick marks */}
          {slides.map((_, i) => (
            <span
              key={i}
              className={`fp-tick ${i === current ? 'fp-tick-active' : ''}`}
              style={{ top: `${(i / (total - 1)) * 100}%` }}
            />
          ))}
        </div>
        {/* section label */}
        <span className="fp-slide-label">{labels?.[current]}</span>
      </div>

    </div>
  );
}

export default FullpageSlider;
