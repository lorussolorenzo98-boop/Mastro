import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

function ThankYouPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>
          ✓
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '500', color: 'var(--text)', marginBottom: '12px' }}>
          Prenotazione confermata!
        </h1>
        <p style={{ fontSize: '16px', color: '#5a6b5a', marginBottom: '8px' }}>
          Il pagamento è andato a buon fine.
        </p>
        <p style={{ fontSize: '14px', color: '#5a6b5a', marginBottom: '32px' }}>
          Riceverai una email di conferma a breve. Il professionista ti contatterà per confermare l'appuntamento.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ background: 'var(--green-dark)', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            Vai alla dashboard
          </button>
          <button onClick={() => navigate('/professionals')}
            style={{ background: 'transparent', color: 'var(--green-dark)', border: '1px solid var(--green-dark)', borderRadius: '6px', padding: '12px 24px', fontSize: '14px', cursor: 'pointer' }}>
            Cerca altri professionisti
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ThankYouPage