import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

function DashboardProfessionistaPage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchBookings()
  }, [token])

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/bookings/professional', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookings(res.data)
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/crea-profilo')
      }
      console.error('Errore caricamento prenotazioni:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:3000/api/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchBookings()
    } catch (error) {
      console.error('Errore aggiornamento stato:', error)
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true
    return b.status === activeTab
  })

  const statusLabel = {
    pending:   { label: 'In attesa',  color: '#854F0B', bg: '#FAEEDA' },
    confirmed: { label: 'Confermata', color: '#0F6E56', bg: '#E1F5EE' },
    completed: { label: 'Completata', color: '#185FA5', bg: '#E6F1FB' },
    cancelled: { label: 'Annullata',  color: '#A32D2D', bg: '#FCEBEB' },
  }

  const metrics = [
    { label: 'In attesa',  value: bookings.filter(b => b.status === 'pending').length,   accent: '#EF9F27' },
    { label: 'Confermate', value: bookings.filter(b => b.status === 'confirmed').length, accent: '#1D9E75' },
    { label: 'Completate', value: bookings.filter(b => b.status === 'completed').length, accent: '#378ADD' },
    { label: 'Totale',     value: bookings.length,                                       accent: '#c8f135' },
  ]

  const tabs = [
    { key: 'pending',   label: 'In attesa' },
    { key: 'confirmed', label: 'Confermate' },
    { key: 'completed', label: 'Completate' },
    { key: 'all',       label: 'Tutte' },
  ]

  const getInitials = (firstname = '', surname = '') =>
    `${firstname.charAt(0)}${surname.charAt(0)}`.toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#0e1e0e', marginBottom: '4px' }}>
            Richieste ricevute
          </h1>
          <p style={{ fontSize: '14px', color: '#5a6b5a', margin: 0 }}>
            Gestisci le prenotazioni dei tuoi clienti
          </p>
        </div>

        {/* METRICHE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              background: '#fff',
              border: '0.5px solid rgba(26,46,26,0.14)',
              borderLeft: `3px solid ${m.accent}`,
              borderRadius: '10px',
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: '12px', color: '#5a6b5a', marginBottom: '6px' }}>{m.label}</div>
              <div style={{ fontSize: '26px', fontWeight: '500', color: '#0e1e0e' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(26,46,26,0.14)', marginBottom: '20px' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '10px 20px',
              fontSize: '14px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #0e1e0e' : '2px solid transparent',
              color: activeTab === tab.key ? '#0e1e0e' : '#5a6b5a',
              fontWeight: activeTab === tab.key ? '500' : '400',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* LISTA */}
        {loading ? (
          <p style={{ color: '#5a6b5a', padding: '40px 0', textAlign: 'center' }}>Caricamento...</p>
        ) : filteredBookings.length === 0 ? (
          <p style={{ color: '#5a6b5a', textAlign: 'center', padding: '60px 0' }}>
            Nessuna richiesta trovata.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredBookings.map(booking => (
              <div key={booking._id} style={{
                background: '#fff',
                border: '0.5px solid rgba(26,46,26,0.14)',
                borderRadius: '12px',
                padding: '18px 20px',
              }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: '#E1F5EE', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '13px', fontWeight: '500',
                      color: '#0F6E56', flexShrink: 0,
                    }}>
                      {getInitials(booking.clientId?.firstname, booking.clientId?.surname)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#0e1e0e', marginBottom: '2px' }}>
                        {booking.clientId?.firstname} {booking.clientId?.surname}
                      </div>
                      <div style={{ fontSize: '12px', color: '#5a6b5a' }}>
                        {new Date(booking.date).toLocaleDateString('it-IT')} · {booking.timeSlot}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px', padding: '4px 12px', borderRadius: '999px',
                    background: statusLabel[booking.status]?.bg,
                    color: statusLabel[booking.status]?.color,
                    fontWeight: '500',
                  }}>
                    {statusLabel[booking.status]?.label}
                  </span>
                </div>

                <div style={{
                  background: '#f7f7f5', borderRadius: '6px',
                  padding: '10px 12px', fontSize: '13px', color: '#5a6b5a',
                  marginBottom: '14px', lineHeight: '1.5',
                }}>
                  {booking.description}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#5a6b5a' }}>
                    {booking.address}&nbsp;·&nbsp;
                    <strong style={{ color: '#0e1e0e', fontWeight: '500' }}>{booking.amount}€</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(booking._id, 'cancelled')}
                          style={{
                            background: 'transparent', color: '#A32D2D',
                            border: '0.5px solid #A32D2D', borderRadius: '7px',
                            padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
                          }}>
                          Rifiuta
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, 'confirmed')}
                          style={{
                            background: '#0e1e0e', color: '#c8f135',
                            border: 'none', borderRadius: '7px',
                            padding: '6px 14px', fontSize: '13px',
                            fontWeight: '500', cursor: 'pointer',
                          }}>
                          Conferma
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'completed')}
                        style={{
                          background: '#185FA5', color: '#fff',
                          border: 'none', borderRadius: '7px',
                          padding: '6px 14px', fontSize: '13px',
                          fontWeight: '500', cursor: 'pointer',
                        }}>
                        Segna completata
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      <Footer />

    </div>
  )
}

export default DashboardProfessionistaPage