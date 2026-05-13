import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import { useIsMobile } from '../hooks/useIsMobile'

function DashboardProfessionistaPage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [professional, setProfessional] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editSuccess, setEditSuccess] = useState('')
  const [editForm, setEditForm] = useState({ category: '', bio: '', city: '', hourlyRate: '' })

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchBookings()
    fetchProfessional()
  }, [token])

  const fetchProfessional = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/professionals/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfessional(res.data)
      setEditForm({
        category: res.data.category,
        bio: res.data.bio || '',
        city: res.data.city,
        hourlyRate: res.data.hourlyRate,
      })
    } catch (error) {
      console.error('Errore caricamento profilo:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/bookings/professional', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookings(res.data)
    } catch (error) {
      if (error.response?.status === 404) navigate('/crea-profilo')
      console.error('Errore caricamento prenotazioni:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async e => {
    e.preventDefault()
    setEditLoading(true)
    setEditSuccess('')
    try {
      const res = await axios.put('http://localhost:3000/api/professionals/me',
        { ...editForm, hourlyRate: Number(editForm.hourlyRate) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProfessional(res.data)
      setEditSuccess('Annuncio aggiornato con successo!')
      setEditMode(false)
    } catch (error) {
      console.error('Errore aggiornamento profilo:', error)
    } finally {
      setEditLoading(false)
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

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '7px',
    border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '13px',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '500', color: '#0e1e0e', marginBottom: '4px' }}>
            Richieste ricevute
          </h1>
          <p style={{ fontSize: '14px', color: '#5a6b5a', margin: 0 }}>
            Gestisci le prenotazioni dei tuoi clienti
          </p>
        </div>

        {/* IL MIO ANNUNCIO */}
        {professional && (
          <div style={{
            background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
            borderRadius: '12px', padding: '18px 20px', marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editMode ? '16px' : '0' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#0e1e0e' }}>Il mio annuncio</div>
              <button
                onClick={() => { setEditMode(!editMode); setEditSuccess('') }}
                style={{
                  background: editMode ? 'transparent' : '#0e1e0e',
                  color: editMode ? '#5a6b5a' : '#c8f135',
                  border: editMode ? '0.5px solid rgba(26,46,26,0.18)' : 'none',
                  borderRadius: '7px', padding: '6px 14px',
                  fontSize: '13px', cursor: 'pointer', fontWeight: '500',
                }}>
                {editMode ? 'Annulla' : 'Modifica'}
              </button>
            </div>

            {editSuccess && !editMode && (
              <div style={{ background: '#E1F5EE', border: '0.5px solid #1D9E75', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#0F6E56', marginTop: '12px' }}>
                {editSuccess}
              </div>
            )}

            {!editMode && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginTop: '14px' }}>
                {[
                  { label: 'Categoria', value: professional.category },
                  { label: 'Città',     value: professional.city },
                  { label: 'Tariffa',   value: `${professional.hourlyRate}€ / ora` },
                  { label: 'Bio',       value: professional.bio || '—' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '11px', color: '#5a6b5a', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#0e1e0e', textTransform: item.label === 'Bio' ? 'none' : 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: item.label === 'Bio' ? 'normal' : 'nowrap' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {editMode && (
              <form onSubmit={handleEditSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Categoria</label>
                    <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={inputStyle}>
                      <option value="idraulico">Idraulico</option>
                      <option value="elettricista">Elettricista</option>
                      <option value="muratore">Muratore</option>
                      <option value="pulizie">Pulizie</option>
                      <option value="giardinaggio">Giardinaggio</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Città</label>
                    <input value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Tariffa oraria (€)</label>
                    <input type="number" value={editForm.hourlyRate} onChange={e => setEditForm({ ...editForm, hourlyRate: e.target.value })} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Bio</label>
                    <input value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <button type="submit" disabled={editLoading} style={{
                  background: '#0e1e0e', color: '#c8f135', border: 'none',
                  borderRadius: '7px', padding: '8px 20px', fontSize: '13px',
                  fontWeight: '500', cursor: 'pointer',
                }}>
                  {editLoading ? 'Salvataggio...' : 'Salva modifiche'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* METRICHE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '10px', marginBottom: '24px',
        }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
              borderLeft: `3px solid ${m.accent}`, borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ fontSize: '12px', color: '#5a6b5a', marginBottom: '6px' }}>{m.label}</div>
              <div style={{ fontSize: '26px', fontWeight: '500', color: '#0e1e0e' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(26,46,26,0.14)', marginBottom: '20px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: isMobile ? '10px 12px' : '10px 20px',
              fontSize: isMobile ? '13px' : '14px',
              border: 'none', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
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
          <p style={{ color: '#5a6b5a', textAlign: 'center', padding: '60px 0' }}>Nessuna richiesta trovata.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredBookings.map(booking => (
              <div key={booking._id} style={{
                background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
                borderRadius: '12px', padding: isMobile ? '14px' : '18px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: '#0F6E56', flexShrink: 0 }}>
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
                  <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '999px', background: statusLabel[booking.status]?.bg, color: statusLabel[booking.status]?.color, fontWeight: '500', flexShrink: 0 }}>
                    {statusLabel[booking.status]?.label}
                  </span>
                </div>

                <div style={{ background: '#f7f7f5', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#5a6b5a', marginBottom: '14px', lineHeight: '1.5' }}>
                  {booking.description}
                </div>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '10px' : '0' }}>
                  <div style={{ fontSize: '13px', color: '#5a6b5a' }}>
                    {booking.address}&nbsp;·&nbsp;
                    <strong style={{ color: '#0e1e0e', fontWeight: '500' }}>{booking.amount}€</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {booking.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(booking._id, 'cancelled')} style={{ background: 'transparent', color: '#A32D2D', border: '0.5px solid #A32D2D', borderRadius: '7px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
                          Rifiuta
                        </button>
                        <button onClick={() => updateStatus(booking._id, 'confirmed')} style={{ background: '#0e1e0e', color: '#c8f135', border: 'none', borderRadius: '7px', padding: '6px 14px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                          Conferma
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button onClick={() => updateStatus(booking._id, 'completed')} style={{ background: '#185FA5', color: '#fff', border: 'none', borderRadius: '7px', padding: '6px 14px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
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