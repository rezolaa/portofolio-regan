import Proyek from '../components/Proyek';
import BgCircuit from '../components/bg/BgCircuit';

function SlideProyek({ active }) {
  return (
    <>
      <BgCircuit active={active} />

      <div className="slide-content-wrap">
        <Proyek forceVisible={active} />
      </div>
    </>
  );
}

export default SlideProyek;
