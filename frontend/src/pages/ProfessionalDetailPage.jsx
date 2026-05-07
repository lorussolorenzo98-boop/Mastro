import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function ProfessionalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [professional, setProfessional] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')

  const slots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/professionals/${id}`)
        setProfessional(res.data)
      } catch (error) {
        console.error('Errore:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfessional()
  }, [id])

  const handleBook = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Seleziona una data e una fascia oraria')
      return
    }
    navigate(`/booking/${id}?date=${selectedDate}&slot=${selectedSlot}`)
  }

  if (loading) return <p style={{ padding: '24px' }}>Caricamento...</p>
  if (!professional) return <p style={{ padding: '24px' }}>Professionista non trovato</p>

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
      
      {/* COLONNA SINISTRA */}
      <div>
        {/* HEADER PROFILO */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '24px', display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--green-dark)', color: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '500', flexShrink: 0 }}>
            {professional.userId?.firstname?.[0]}{professional.userId?.surname?.[0]}
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--text)', marginBottom: '4px' }}>
              {professional.userId?.firstname} {professional.userId?.surname}
            </h1>
            <div style={{ fontSize: '14px', color: '#5a6b5a', marginBottom: '8px' }}>
              {professional.category} · {professional.city}
            </div>
            <div style={{ fontSize: '13px', color: '#c8a000' }}>
              {'★'.repeat(Math.round(professional.rating))} {professional.rating} · {professional.reviewsCount} recensioni
            </div>
          </div>
        </div>

        {/* BIO */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '12px' }}>Su di me</h2>
          <p style={{ fontSize: '14px', color: '#5a6b5a', lineHeight: '1.7' }}>{professional.bio || 'Nessuna biografia disponibile.'}</p>
        </div>

        {/* INFO */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '16px' }}>Informazioni</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Categoria', value: professional.category },
              { label: 'Città', value: professional.city },
              { label: 'Tariffa oraria', value: `${professional.hourlyRate}€ / ora` },
              { label: 'Valutazione', value: `${professional.rating} / 5` },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: '12px', color: '#5a6b5a', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLONNA DESTRA - PRENOTAZIONE */}
      <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '20px', position: 'sticky', top: '24px', height: 'fit-content' }}>
        <div style={{ fontSize: '28px', fontWeight: '500', color: 'var(--green-dark)', marginBottom: '4px' }}>
          {professional.hourlyRate}€ <span style={{ fontSize: '15px', fontWeight: '400', color: '#5a6b5a' }}>/ ora</span>
        </div>
        <div style={{ fontSize: '12px', color: '#c8a000', marginBottom: '16px' }}>
          ★ {professional.rating} · {professional.reviewsCount} recensioni
        </div>

        <div style={{ height: '1px', background: '#eee', margin: '16px 0' }} />

        <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Seleziona una data</label>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', marginBottom: '16px' }} />

        <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Fascia oraria</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px' }}>
          {slots.map(slot => (
            <button key={slot} onClick={() => setSelectedSlot(slot)}
              style={{ padding: '8px', borderRadius: '6px', border: `1px solid ${selectedSlot === slot ? 'var(--green-dark)' : '#ddd'}`, background: selectedSlot === slot ? 'var(--green-dark)' : '#fff', color: selectedSlot === slot ? '#fff' : 'var(--text)', fontSize: '13px', cursor: 'pointer' }}>
              {slot}
            </button>
          ))}
        </div>

        <button onClick={handleBook}
          style={{ width: '100%', background: 'var(--lime)', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '13px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '10px' }}>
          Prenota ora
        </button>
        <p style={{ fontSize: '11px', color: '#5a6b5a', textAlign: 'center' }}>Pagamento sicuro con Stripe</p>
      </div>
    </div>
  )
}

export default ProfessionalDetailPage