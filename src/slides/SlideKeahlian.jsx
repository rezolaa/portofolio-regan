import Keahlian from '../components/Keahlian';
import BgBinary from '../components/bg/BgBinary';

function SlideKeahlian({ active }) {
  return (
    <>
      <BgBinary active={active} />

      <div className="slide-content-wrap">
        <Keahlian forceVisible={active} />
      </div>
    </>
  );
}

export default SlideKeahlian;
