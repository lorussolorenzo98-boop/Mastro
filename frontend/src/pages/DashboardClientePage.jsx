import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import { useIsMobile } from '../hooks/useIsMobile'

function DashboardClientePage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set())
  const [activeReviewForm, setActiveReviewForm] = useState(null) // bookingId con form aperto
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchBookings()
    fetchMyReviews()
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

  const fetchMyReviews = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/reviews/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviewedBookingIds(new Set(res.data.map(r => r.bookingId)))
    } catch (error) {
      console.error('Errore caricamento recensioni:', error)
    }
  }

  const submitReview = async (bookingId) => {
    setReviewLoading(true)
    try {
      await axios.post('http://localhost:3000/api/reviews',
        { bookingId, rating: reviewForm.rating, comment: reviewForm.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReviewedBookingIds(prev => new Set([...prev, bookingId]))
      setActiveReviewForm(null)
      setReviewForm({ rating: 5, comment: '' })
      setReviewSuccess(bookingId)
      setTimeout(() => setReviewSuccess(''), 3000)
    } catch (error) {
      console.error('Errore invio recensione:', error)
    } finally {
      setReviewLoading(false)
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
    cancelled: { label: 'Annullata', color: '#A32D2D', bg: '#FCEBEB' },
  }

  const metrics = [
    { label: 'Totale', value: bookings.length, accent: '#c8f135' },
    { label: 'In attesa', value: bookings.filter(b => b.status === 'pending').length, accent: '#EF9F27' },
    { label: 'Completate', value: bookings.filter(b => b.status === 'completed').length, accent: '#378ADD' },
  ]

  const tabs = [
    { key: 'all', label: 'Tutte' },
    { key: 'pending', label: 'In attesa' },
    { key: 'confirmed', label: 'Confermate' },
    { key: 'completed', label: 'Completate' },
  ]

  const getCategoryInitials = (category = '') =>
    category.slice(0, 2).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '500', color: '#0e1e0e', marginBottom: '4px' }}>
            Le mie prenotazioni
          </h1>
          <p style={{ fontSize: '14px', color: '#5a6b5a', margin: 0 }}>
            Ciao {user?.firstname}, ecco le tue prenotazioni
          </p>
        </div>

        {/* METRICHE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
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
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5a6b5a' }}>
            <p style={{ marginBottom: '16px' }}>Nessuna prenotazione trovata.</p>
            <button onClick={() => navigate('/professionals')} style={{ background: '#0e1e0e', color: '#c8f135', border: 'none', borderRadius: '7px', padding: '10px 22px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Trova un professionista
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredBookings.map(booking => (
              <div key={booking._id} style={{
                background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
                borderRadius: '12px', padding: isMobile ? '14px' : '18px 20px',
              }}>

                {/* TOP */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: '#0e1e0e', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '13px', fontWeight: '500',
                      color: '#c8f135', flexShrink: 0, overflow: 'hidden',
                    }}>
                      {booking.professionalId?.userId?.avatar ? (
                        <img src={booking.professionalId.userId.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        `${booking.professionalId?.userId?.firstname?.[0] || ''}${booking.professionalId?.userId?.surname?.[0] || ''}`
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#0e1e0e', marginBottom: '2px' }}>
                        {booking.professionalId?.userId?.firstname} {booking.professionalId?.userId?.surname}
                      </div>
                      <div style={{ fontSize: '12px', color: '#5a6b5a', textTransform: 'capitalize' }}>
                        {booking.professionalId?.category} · {booking.professionalId?.city}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px', padding: '4px 12px', borderRadius: '999px',
                    background: statusLabel[booking.status]?.bg,
                    color: statusLabel[booking.status]?.color,
                    fontWeight: '500', flexShrink: 0,
                  }}>
                    {statusLabel[booking.status]?.label}
                  </span>
                </div>

                {/* DESCRIZIONE */}
                <div style={{ background: '#f7f7f5', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#5a6b5a', marginBottom: '14px', lineHeight: '1.5' }}>
                  {booking.description}
                </div>

                {/* BOTTOM */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '6px' : '0' }}>
                  <div style={{ fontSize: '13px', color: '#5a6b5a' }}>
                    {new Date(booking.date).toLocaleDateString('it-IT')} · {booking.timeSlot}&nbsp;·&nbsp;{booking.address}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: '#0e1e0e' }}>
                    {booking.amount}€
                  </div>
                </div>

                {/* RECENSIONE — solo per prenotazioni completate */}
                {booking.status === 'completed' && (
                  <div style={{ marginTop: '14px', borderTop: '0.5px solid rgba(26,46,26,0.08)', paddingTop: '12px' }}>

                    {reviewSuccess === booking._id && (
                      <div style={{ fontSize: '13px', color: '#0F6E56', background: '#E1F5EE', borderRadius: '6px', padding: '8px 12px' }}>
                        Recensione inviata!
                      </div>
                    )}

                    {reviewedBookingIds.has(booking._id) && reviewSuccess !== booking._id && (
                      <div style={{ fontSize: '13px', color: '#5a6b5a' }}>✓ Recensione già inviata</div>
                    )}

                    {!reviewedBookingIds.has(booking._id) && reviewSuccess !== booking._id && (
                      <>
                        {activeReviewForm !== booking._id ? (
                          <button
                            onClick={() => { setActiveReviewForm(booking._id); setReviewForm({ rating: 5, comment: '' }) }}
                            style={{ background: 'transparent', color: '#185FA5', border: '0.5px solid #185FA5', borderRadius: '7px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}>
                            Lascia recensione
                          </button>
                        ) : (
                          <div>
                            {/* STELLE */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: star <= reviewForm.rating ? '#BA7517' : '#ddd', padding: '0' }}>
                                  ★
                                </button>
                              ))}
                            </div>
                            {/* COMMENTO */}
                            <textarea
                              value={reviewForm.comment}
                              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                              placeholder="Scrivi un commento (opzionale)..."
                              style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '13px', height: '70px', resize: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => submitReview(booking._id)}
                                disabled={reviewLoading}
                                style={{ background: '#0e1e0e', color: '#c8f135', border: 'none', borderRadius: '7px', padding: '7px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                                {reviewLoading ? 'Invio...' : 'Invia'}
                              </button>
                              <button
                                onClick={() => setActiveReviewForm(null)}
                                style={{ background: 'transparent', color: '#5a6b5a', border: '0.5px solid rgba(26,46,26,0.18)', borderRadius: '7px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' }}>
                                Annulla
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      <Footer />

    </div>
  )
}

export default DashboardClientePage