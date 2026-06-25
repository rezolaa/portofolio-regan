import Tentang from '../components/Tentang';
import BgMatrix from '../components/bg/BgMatrix';

function SlideTentang({ active }) {
  return (
    <>
      {/* bg renders at fixed/viewport level */}
      <BgMatrix active={active} />

      <div className="slide-content-wrap">
        <Tentang forceVisible={active} />
      </div>
    </>
  );
}

export default SlideTentang;
