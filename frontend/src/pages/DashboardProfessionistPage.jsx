import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

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
    pending: { label: 'In attesa', color: '#854F0B', bg: '#FAEEDA' },
    confirmed: { label: 'Confermata', color: '#0F6E56', bg: '#E1F5EE' },
    completed: { label: 'Completata', color: '#185FA5', bg: '#E6F1FB' },
    cancelled: { label: 'Annullata', color: '#cc0000', bg: '#fff0f0' },
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--text)', marginBottom: '4px' }}>
          Richieste ricevute
        </h1>
        <p style={{ fontSize: '14px', color: '#5a6b5a' }}>Gestisci le prenotazioni dei tuoi clienti</p>
      </div>

      {/* METRICHE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Nuove richieste', value: bookings.filter(b => b.status === 'pending').length },
          { label: 'Confermate', value: bookings.filter(b => b.status === 'confirmed').length },
          { label: 'Completate', value: bookings.filter(b => b.status === 'completed').length },
          { label: 'Totale', value: bookings.length },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#5a6b5a', marginBottom: '6px' }}>{m.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '500', color: 'var(--text)' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
        {[
          { key: 'pending', label: 'In attesa' },
          { key: 'confirmed', label: 'Confermate' },
          { key: 'completed', label: 'Completate' },
          { key: 'all', label: 'Tutte' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ padding: '10px 20px', fontSize: '14px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === tab.key ? '2px solid var(--green-dark)' : '2px solid transparent', color: activeTab === tab.key ? 'var(--green-dark)' : '#5a6b5a', fontWeight: activeTab === tab.key ? '500' : '400' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* LISTA */}
      {loading ? (
        <p>Caricamento...</p>
      ) : filteredBookings.length === 0 ? (
        <p style={{ color: '#5a6b5a', textAlign: 'center', padding: '40px' }}>Nessuna richiesta trovata.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredBookings.map(booking => (
            <div key={booking._id} style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '18px 20px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text)', marginBottom: '2px' }}>
                    {booking.clientId?.firstname} {booking.clientId?.surname}
                  </div>
                  <div style={{ fontSize: '13px', color: '#5a6b5a' }}>
                    {new Date(booking.date).toLocaleDateString('it-IT')} · {booking.timeSlot}
                  </div>
                </div>
                <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '999px', background: statusLabel[booking.status]?.bg, color: statusLabel[booking.status]?.color }}>
                  {statusLabel[booking.status]?.label}
                </span>
              </div>

              <div style={{ background: '#f7f7f5', borderRadius: '6px', padding: '10px', fontSize: '13px', color: '#5a6b5a', marginBottom: '12px' }}>
                {booking.description}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', color: '#5a6b5a' }}>
                  {booking.address} · <strong style={{ color: 'var(--text)' }}>{booking.amount}€</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {booking.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(booking._id, 'cancelled')}
                        style={{ background: 'transparent', color: '#cc0000', border: '1px solid #cc0000', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
                        Rifiuta
                      </button>
                      <button onClick={() => updateStatus(booking._id, 'confirmed')}
                        style={{ background: 'var(--green-dark)', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
                        Conferma
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button onClick={() => updateStatus(booking._id, 'completed')}
                      style={{ background: '#185FA5', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
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
  )
}

export default DashboardProfessionistaPage