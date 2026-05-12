import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Footer from '../components/Footer'

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
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '24px' }}>

        {/* BACK */}
        <button onClick={() => navigate(-1)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', color: '#5a6b5a', border: 'none',
          background: 'transparent', cursor: 'pointer', padding: '0',
          marginBottom: '16px',
        }}>
          ← Torna alla ricerca
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', alignItems: 'start' }}>

          {/* COLONNA SINISTRA */}
          <div>

            {/* HEADER */}
            <div style={{
              background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
              borderRadius: '12px', overflow: 'hidden',
              display: 'flex', marginBottom: '12px',
            }}>
              <div style={{
                width: '110px', minWidth: '110px', background: '#0e1e0e',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '20px 12px',
              }}>
                {professional.userId?.avatar ? (
                  <img src={professional.userId.avatar} alt="avatar"
                    style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(200,241,53,0.25)' }} />
                ) : (
                  <div style={{
                    width: '68px', height: '68px', borderRadius: '50%',
                    background: '#1a2e1a', border: '1.5px solid rgba(200,241,53,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', fontWeight: '500', color: '#c8f135',
                  }}>
                    {professional.userId?.firstname?.[0]}{professional.userId?.surname?.[0]}
                  </div>
                )}
                <div style={{
                  background: 'rgba(200,241,53,0.1)', color: '#c8f135',
                  fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                  textTransform: 'capitalize', textAlign: 'center',
                }}>
                  {professional.category}
                </div>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#0e1e0e', marginBottom: '4px' }}>
                  {professional.userId?.firstname} {professional.userId?.surname}
                </h1>
                <div style={{ fontSize: '13px', color: '#5a6b5a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📍 {professional.city}
                </div>
                <div style={{ fontSize: '12px', color: '#BA7517' }}>
                  ★ {professional.rating} · {professional.reviewsCount} recensioni
                </div>
              </div>
            </div>

            {/* BIO */}
            <div style={{
              background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
              borderRadius: '12px', padding: '18px', marginBottom: '12px',
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0e1e0e', marginBottom: '10px' }}>Su di me</h2>
              <p style={{ fontSize: '13px', color: '#5a6b5a', lineHeight: '1.7', margin: 0 }}>
                {professional.bio || 'Nessuna biografia disponibile.'}
              </p>
            </div>

            {/* INFO */}
            <div style={{
              background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
              borderRadius: '12px', padding: '18px',
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0e1e0e', marginBottom: '14px' }}>Informazioni</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[
                  { label: 'Categoria', value: professional.category },
                  { label: 'Città', value: professional.city },
                  { label: 'Tariffa oraria', value: `${professional.hourlyRate}€ / ora` },
                  { label: 'Valutazione', value: `${professional.rating} / 5` },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '11px', color: '#5a6b5a', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#0e1e0e', textTransform: 'capitalize' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLONNA DESTRA - PRENOTAZIONE */}
          <div style={{
            background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
            borderRadius: '12px', padding: '18px',
            position: 'sticky', top: '24px',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '500', color: '#0e1e0e', marginBottom: '4px' }}>
              {professional.hourlyRate}€ <span style={{ fontSize: '14px', fontWeight: '400', color: '#5a6b5a' }}>/ ora</span>
            </div>
            <div style={{ fontSize: '12px', color: '#BA7517', marginBottom: '16px' }}>
              ★ {professional.rating} · {professional.reviewsCount} recensioni
            </div>

            <div style={{ height: '0.5px', background: 'rgba(26,46,26,0.1)', margin: '14px 0' }} />

            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '7px', color: '#0e1e0e' }}>
              Seleziona una data
            </label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '7px', border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '13px', marginBottom: '14px', boxSizing: 'border-box' }} />

            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '7px', color: '#0e1e0e' }}>
              Fascia oraria
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px' }}>
              {slots.map(slot => (
                <button key={slot} onClick={() => setSelectedSlot(slot)} style={{
                  padding: '8px', borderRadius: '7px', fontSize: '13px', cursor: 'pointer',
                  border: `0.5px solid ${selectedSlot === slot ? '#0e1e0e' : 'rgba(26,46,26,0.18)'}`,
                  background: selectedSlot === slot ? '#0e1e0e' : '#fff',
                  color: selectedSlot === slot ? '#c8f135' : '#0e1e0e',
                  fontWeight: selectedSlot === slot ? '500' : '400',
                }}>
                  {slot}
                </button>
              ))}
            </div>

            <button onClick={handleBook} style={{
              width: '100%', background: '#c8f135', color: '#0e1e0e',
              border: 'none', borderRadius: '8px', padding: '13px',
              fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '8px',
            }}>
              Prenota ora
            </button>
            <div style={{ fontSize: '11px', color: '#5a6b5a', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              🔒 Pagamento sicuro con Stripe
            </div>
          </div>

        </div>
      </div>

      <Footer />

    </div>
  )
}

export default ProfessionalDetailPage