import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

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
      <section style={{ background: 'var(--green-dark)', padding: '56px 24px 64px', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: '34px', fontWeight: '500', color: '#fff', marginBottom: '12px', lineHeight: '1.25' }}>
          Trova il professionista giusto,<br />
          <em style={{ color: 'var(--lime)', fontStyle: 'normal' }}>vicino a te</em>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
          Idraulici, elettricisti, muratori, pulizie e giardinieri — prenota online in pochi minuti
        </p>

        {/* SEARCH BAR */}
        <div style={{ display: 'flex', maxWidth: '580px', margin: '0 auto', background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--lime)' }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '14px', padding: '12px 14px', outline: 'none', borderRight: '1px solid #eee' }}
          >
            <option value="">Tutte le categorie</option>
            <option value="idraulico">Idraulico</option>
            <option value="elettricista">Elettricista</option>
            <option value="muratore">Muratore</option>
            <option value="pulizie">Pulizie</option>
            <option value="giardinaggio">Giardinaggio</option>
          </select>
          <input
            type="text"
            placeholder="La tua città..."
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '14px', padding: '12px 14px', outline: 'none', flex: 1 }}
          />
          <button
            onClick={handleSearch}
            style={{ background: 'var(--lime)', color: 'var(--green-dark)', border: 'none', padding: '12px 22px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
          >
            Cerca
          </button>
        </div>

        {/* CATEGORIE RAPIDE */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
          {['Idraulico', 'Elettricista', 'Muratore', 'Pulizie', 'Giardinaggio'].map(cat => (
            <span
              key={cat}
              onClick={() => navigate(`/professionals?category=${cat.toLowerCase()}`)}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(200,241,53,0.3)', borderRadius: '999px', padding: '6px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section style={{ background: 'var(--green-dark)', padding: '44px 24px', marginTop: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#fff', marginBottom: '24px', textAlign: 'center' }}>Come funziona</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', maxWidth: '700px', margin: '0 auto' }}>
          {[
            { num: '1', title: 'Cerca', desc: 'Scegli categoria e zona' },
            { num: '2', title: 'Scegli', desc: 'Confronta profili e recensioni' },
            { num: '3', title: 'Prenota', desc: 'Seleziona data e ora' },
            { num: '4', title: 'Paga', desc: 'Pagamento sicuro con Stripe' },
          ].map(step => (
            <div key={step.num} style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(200,241,53,0.12)', border: '1px solid rgba(200,241,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <span style={{ fontSize: '20px', fontWeight: '500', color: 'var(--lime)' }}>{step.num}</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#fff', marginBottom: '4px' }}>{step.title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage