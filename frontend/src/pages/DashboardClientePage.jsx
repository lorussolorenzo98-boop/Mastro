import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function DashboardClientePage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchBookings()
  }, [token])

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/bookings/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookings(res.data)
    } catch (error) {
      console.error('Errore caricamento prenotazioni:', error)
    } finally {
      setLoading(false)
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
          Le mie prenotazioni
        </h1>
        <p style={{ fontSize: '14px', color: '#5a6b5a' }}>Ciao {user?.firstname}, ecco le tue prenotazioni</p>
      </div>

      {/* METRICHE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Totale', value: bookings.length },
          { label: 'In attesa', value: bookings.filter(b => b.status === 'pending').length },
          { label: 'Completate', value: bookings.filter(b => b.status === 'completed').length },
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
          { key: 'all', label: 'Tutte' },
          { key: 'pending', label: 'In attesa' },
          { key: 'confirmed', label: 'Confermate' },
          { key: 'completed', label: 'Completate' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ padding: '10px 20px', fontSize: '14px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === tab.key ? '2px solid var(--green-dark)' : '2px solid transparent', color: activeTab === tab.key ? 'var(--green-dark)' : '#5a6b5a', fontWeight: activeTab === tab.key ? '500' : '400' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* LISTA PRENOTAZIONI */}
      {loading ? (
        <p>Caricamento...</p>
      ) : filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5a6b5a' }}>
          <p>Nessuna prenotazione trovata.</p>
          <button onClick={() => navigate('/professionals')}
            style={{ marginTop: '16px', background: 'var(--lime)', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            Trova un professionista
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredBookings.map(booking => (
            <div key={booking._id} style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '18px 20px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text)', marginBottom: '4px' }}>
                  {booking.professionalId?.category || 'Professionista'} — {booking.professionalId?.city}
                </div>
                <div style={{ fontSize: '13px', color: '#5a6b5a', marginBottom: '4px' }}>
                  {new Date(booking.date).toLocaleDateString('it-IT')} · {booking.timeSlot}
                </div>
                <div style={{ fontSize: '13px', color: '#5a6b5a' }}>
                  {booking.address}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '999px', background: statusLabel[booking.status]?.bg, color: statusLabel[booking.status]?.color, display: 'inline-block', marginBottom: '8px' }}>
                  {statusLabel[booking.status]?.label}
                </span>
                <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text)' }}>
                  {booking.amount}€
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardClientePage