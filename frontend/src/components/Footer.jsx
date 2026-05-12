import { useNavigate } from 'react-router-dom'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer style={{ background: '#0e1e0e', padding: '56px 32px 28px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '500', color: '#fff', marginBottom: '12px' }}>
              Mastr<span style={{ color: '#c8f135' }}>o</span>
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.8' }}>
              Il marketplace italiano per trovare professionisti del settore domestico vicino a te.
            </div>
          </div>
          {[
            { title: 'Servizi', links: [
              { label: 'Idraulici', path: '/professionals?category=idraulico' },
              { label: 'Elettricisti', path: '/professionals?category=elettricista' },
              { label: 'Muratori', path: '/professionals?category=muratore' },
              { label: 'Pulizie', path: '/professionals?category=pulizie' },
              { label: 'Giardinaggio', path: '/professionals?category=giardinaggio' },
            ]},
            { title: 'Azienda', links: [
              { label: 'Chi siamo', path: '/' },
              { label: 'Come funziona', path: '/' },
              { label: 'Diventa professionista', path: '/register' },
            ]},
            { title: 'Legale', links: [
              { label: 'Privacy Policy', path: '/' },
              { label: 'Termini di servizio', path: '/' },
              { label: 'Contatti', path: '/' },
            ]},
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link.label}
                  onClick={() => navigate(link.path)}
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', cursor: 'pointer' }}>
                  {link.label}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>© 2025 Mastro — Tutti i diritti riservati</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>Pagamenti sicuri con Stripe</div>
        </div>
    </footer>
  )
}

export default Footer