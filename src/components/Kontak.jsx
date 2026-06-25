import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const contacts = [
  { icon:'📧', label:'Email',    value:'regangradasi18@gmail.com',  href:'mailto:regangradasi18@gmail.com' },
  { icon:'💼', label:'LinkedIn', value:'Regan Gradasi Matahari Jingga', href:'https://id.linkedin.com/in/regan-gmj' },
  { icon:'🐙', label:'GitHub',   value:'github.com/rezolaa',     href:'https://github.com/rezolaa' },
];

function ContactCard({ contact, rowVisible }) {
  const cardRef = useRef(null);
  const onMove = (e) => {
    const card = cardRef.current;
    const r  = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * 10;
    const ry = ((e.clientX - r.left - r.width  / 2) / r.width)  * -10;
    card.style.transform = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };
  const onLeave = () => { cardRef.current.style.transform = ''; };

  return (
    <a href={contact.href} className={`contact-card reveal-row ${rowVisible ? 'row-visible' : ''}`}
       ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave} target="_blank" rel="noreferrer">
      <span className="contact-icon">{contact.icon}</span>
      <div>
        <div className="contact-label">{contact.label}</div>
        <div className="contact-value">{contact.value}</div>
      </div>
      <span className="contact-arrow">→</span>
    </a>
  );
}

function KontakForm({ visible }) {
  const [nama, setNama]     = useState('');
  const [email, setEmail]   = useState('');
  const [pesan, setPesan]   = useState('');
  const [sent, setSent]     = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Pesan dari ${nama}`);
    const body    = encodeURIComponent(`Nama: ${nama}\nEmail: ${email}\n\n${pesan}`);
    window.location.href = `mailto:regangradasi18@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="form-success">
        <svg className="checkmark" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path  className="checkmark-check"  fill="none" d="M14 27l8 8 16-16" />
        </svg>
        <p className="success-text">Kirim Pesan Berhasil!</p>
        <p className="success-sub">Terima kasih, email Anda telah terbuka di klien email Anda.</p>
        <button
          className="form-btn-reset"
          onClick={() => { setSent(false); setNama(''); setEmail(''); setPesan(''); }}
        >
          ↩ Kirim Pesan Lagi
        </button>
      </div>
    );
  }

  return (
    <form
      className={`kontak-form reveal-child ${visible ? 'child-visible' : ''}`}
      style={{ '--delay': '0.35s' }}
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label className="form-label" htmlFor="kontak-nama">Nama Anda</label>
        <input
          id="kontak-nama"
          className="form-input"
          type="text"
          placeholder="Masukkan nama Anda..."
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="kontak-email">Email Anda</label>
        <input
          id="kontak-email"
          className="form-input"
          type="email"
          placeholder="email@contoh.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="kontak-pesan">Pesan</label>
        <textarea
          id="kontak-pesan"
          className="form-input form-textarea"
          placeholder="Tuliskan pesan Anda di sini..."
          rows={4}
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="form-btn">
        <span>Kirim Pesan</span>
        <span className="btn-arrow"></span>
      </button>
    </form>
  );
}

function Kontak({ forceVisible }) {
  const [ref, observed] = useReveal(0.15);
  const visible = forceVisible !== undefined ? forceVisible : observed;
  const [rowsVisible, setRowsVisible] = useState([]);
  const triggered = useRef(false);

  useEffect(() => {
    if (!visible || triggered.current) return;
    triggered.current = true;
    contacts.forEach((_, i) => setTimeout(() => setRowsVisible((p) => [...p, i]), 300 + i * 160));
  }, [visible]);

  return (
    <section
      id="kontak"
      className={`card card-hover reveal-section reveal-from-bottom ${visible ? 'reveal-visible' : ''}`}
      ref={ref}
    >
      <div className={`card-sweep ${visible ? 'sweep-run' : ''}`} />
      <div className="card-tech-label">contact.json</div>
      <h2 className={`reveal-child ${visible ? 'child-visible' : ''}`} style={{ '--delay': '0.1s' }}>Kontak</h2>
      <p className={`kontak-sub reveal-child ${visible ? 'child-visible' : ''}`} style={{ '--delay': '0.2s' }}>
        Tertarik berkolaborasi? Jangan ragu untuk menghubungi saya.
      </p>

      <div className="kontak-layout">
        <div className="contacts-list">
          {contacts.map((c, i) => (
            <ContactCard key={c.label} contact={c} rowVisible={rowsVisible.includes(i)} />
          ))}
        </div>
        <KontakForm visible={visible} />
      </div>
    </section>
  );
}

export default Kontak;
