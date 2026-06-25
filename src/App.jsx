import FullpageSlider from './components/FullpageSlider';
import CursorGlow from './components/CursorGlow';

import SlideHero     from './slides/SlideHero';
import SlideTentang  from './slides/SlideTentang';
import SlideKeahlian from './slides/SlideKeahlian';
import SlideProyek   from './slides/SlideProyek';
import SlideKontak   from './slides/SlideKontak';

const SLIDES = [SlideHero, SlideTentang, SlideKeahlian, SlideProyek, SlideKontak];
const LABELS = ['Home', 'Tentang', 'Keahlian', 'Proyek', 'Kontak'];

function App() {
  return (
    <>
      <CursorGlow />
      <FullpageSlider slides={SLIDES} labels={LABELS} />
    </>
  );
}

export default App;
