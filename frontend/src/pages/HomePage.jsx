import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import star from '../assets/Star_light.png'
import shield from '../assets/Chield_check_light.png'
import lightning from '../assets/lightning_light.png'
import pin from '../assets/Pin_light.png'
import Footer from '../components/Footer'

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = target / (duration / 16)
        const timer = setInterval(() => {
          start += step
          if (start >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(Math.floor(start))
          }
        }, 16)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return [count, ref]
}

function StatItem({ value, suffix, label }) {
  const [count, ref] = useCountUp(value)
  return (
    <div ref={ref} style={{ flex: 1, textAlign: 'center', padding: '24px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize: '28px', fontWeight: '500', color: '#c8f135' }}>
        {count.toLocaleString('it-IT')}{suffix}
      </div>
      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

const categories = [
  { label: 'Idraulico', value: 'idraulico', img: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80' },
  { label: 'Elettricista', value: 'elettricista', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
  { label: 'Muratore', value: 'muratore', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
  { label: 'Pulizie', value: 'pulizie', img: 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=400&q=80' },
  { label: 'Giardinaggio', value: 'giardinaggio', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
]

const container = { maxWidth: '1200px', margin: '0 auto', width: '100%' }

function HomePage() {
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    navigate(`/professionals?category=${category}&city=${city}`)
  }

  return (
    <div>

      {/* HERO */}
      <section style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=80" alt="hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,30,14,0.75)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '44px', fontWeight: '500', color: '#fff', marginBottom: '16px', lineHeight: '1.2' }}>
            Trova il professionista giusto,<br />
            <em style={{ color: '#c8f135', fontStyle: 'normal' }}>vicino a te</em>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            Idraulici, elettricisti, muratori, pulizie e giardinieri — prenota online in pochi minuti
          </p>

          <div style={{ display: 'flex', width: '100%', maxWidth: '620px', background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '2px solid #c8f135', marginBottom: '20px' }}>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '15px', color: '#1a2e1a', padding: '15px 16px', outline: 'none', borderRight: '1px solid rgba(26,46,26,0.1)' }}>
              <option value="">Tutte le categorie</option>
              <option value="idraulico">Idraulico</option>
              <option value="elettricista">Elettricista</option>
              <option value="muratore">Muratore</option>
              <option value="pulizie">Pulizie</option>
              <option value="giardinaggio">Giardinaggio</option>
            </select>
            <input type="text" placeholder="La tua città..."
              value={city} onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{ border: 'none', background: 'transparent', fontSize: '15px', color: '#1a2e1a', padding: '15px 16px', outline: 'none', flex: 1 }} />
            <button onClick={handleSearch}
              style={{ background: '#c8f135', color: '#0e1e0e', border: 'none', padding: '15px 28px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Cerca
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <span key={cat.value} onClick={() => navigate(`/professionals?category=${cat.value}`)}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(200,241,53,0.3)', borderRadius: '999px', padding: '7px 18px', fontSize: '14px', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ display: 'flex', background: '#0e1e0e' }}>
        <StatItem value={500} suffix="+" label="Professionisti verificati" />
        <StatItem value={2400} suffix="+" label="Prenotazioni completate" />
        <div style={{ flex: 1, textAlign: 'center', padding: '24px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '28px', fontWeight: '500', color: '#c8f135' }}>4.8 ★</div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Valutazione media</div>
        </div>
        <StatItem value={50} suffix="+" label="Città in Italia" />
      </div>

      {/* CATEGORIE */}
      <section style={{ padding: '64px 32px', background: '#fff' }}>
        <div style={container}>
          <h2 style={{ fontSize: '26px', fontWeight: '500', color: '#1a2e1a', marginBottom: '32px' }}>Esplora i servizi</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {categories.map(cat => (
              <div key={cat.value} onClick={() => navigate(`/professionals?category=${cat.value}`)}
                style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '160px', cursor: 'pointer' }}>
                <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,30,14,0.85) 0%, rgba(14,30,14,0.1) 60%)', display: 'flex', alignItems: 'flex-end', padding: '16px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '500', color: '#fff' }}>{cat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section style={{ background: '#1a2e1a', padding: '72px 32px' }}>
        <div style={container}>
          <h2 style={{ fontSize: '26px', fontWeight: '500', color: '#fff', textAlign: 'center', marginBottom: '56px' }}>Come funziona</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {[
              { num: '1', title: 'Cerca', desc: 'Scegli la categoria e la tua città' },
              { num: '2', title: 'Scegli', desc: 'Confronta profili, tariffe e recensioni' },
              { num: '3', title: 'Prenota', desc: 'Seleziona data e fascia oraria' },
              { num: '4', title: 'Paga', desc: 'Pagamento sicuro con Stripe' },
            ].map(step => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(200,241,53,0.15)', border: '1px solid rgba(200,241,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <span style={{ fontSize: '22px', fontWeight: '500', color: '#c8f135' }}>{step.num}</span>
                </div>
                <div style={{ fontSize: '17px', fontWeight: '500', color: '#fff', marginBottom: '8px' }}>{step.title}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERCHÉ MASTRO */}
      <section style={{ padding: '72px 32px', background: '#f0f4ee' }}>
        <div style={container}>
          <h2 style={{ fontSize: '26px', fontWeight: '500', color: '#1a2e1a', textAlign: 'center', marginBottom: '56px' }}>Perché scegliere Mastro</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {[
              { icon: star, title: 'Professionisti verificati', desc: 'Ogni professionista è valutato da clienti reali' },
              { icon: shield, title: 'Pagamento sicuro', desc: 'Transazioni protette con Stripe' },
              { icon: lightning, title: 'Risposta rapida', desc: 'Conferma entro 2 ore dalla prenotazione' },
              { icon: pin, title: 'Vicino a te', desc: 'Professionisti nella tua città o quartiere' },
            ].map(b => (
              <div key={b.title} style={{ textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#e1f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <img src={b.icon} alt={b.title} style={{ width: '32px', height: '32px' }} />
                </div>
                <div style={{ fontSize: '17px', fontWeight: '500', color: '#1a2e1a', marginBottom: '8px' }}>{b.title}</div>
                <div style={{ fontSize: '14px', color: '#5a6b5a', lineHeight: '1.6' }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PROFESSIONISTA */}
      <section style={{ padding: '64px 32px', background: '#f0f4ee' }}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(26,46,26,0.1)' }}>
            <img src="https://plus.unsplash.com/premium_photo-1664910047950-8f6736941f99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29ya2luZyUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="professionista"
              style={{ height: '360px', width: '100%', objectFit: 'cover' }} />
            <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '500', color: '#1a2e1a', marginBottom: '14px' }}>Sei un professionista?</h2>
              <p style={{ fontSize: '16px', color: '#5a6b5a', lineHeight: '1.7', marginBottom: '28px' }}>
                Unisciti a Mastro e inizia a ricevere prenotazioni online. Crea il tuo profilo in pochi minuti e raggiungi migliaia di clienti nella tua zona.
              </p>
              <button onClick={() => navigate('/register')}
                style={{ background: '#c8f135', color: '#0e1e0e', border: 'none', borderRadius: '6px', padding: '14px 28px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', width: 'fit-content' }}>
                Crea il tuo profilo →
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default HomePage