import Kontak from '../components/Kontak';
import Footer from '../components/Footer';
import BgNetwork from '../components/bg/BgNetwork';

function SlideKontak({ active }) {
  return (
    <>
      <BgNetwork active={active} />

      <div className="slide-content-wrap slide-last">
        <Kontak forceVisible={active} />
        <Footer />
      </div>
    </>
  );
}

export default SlideKontak;
