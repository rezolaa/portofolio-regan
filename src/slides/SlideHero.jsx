import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FloatingIcons from '../components/FloatingIcons';
import BgMeteor from '../components/bg/BgMeteor';

function SlideHero({ active, onGoSlide }) {
  return (
    <div className="slide-hero-wrap">
      <BgMeteor active={active} />
      <FloatingIcons />
      <Navbar inSlider onGoSlide={onGoSlide} />
      <Hero onGoSlide={onGoSlide} />
    </div>
  );
}

export default SlideHero;
