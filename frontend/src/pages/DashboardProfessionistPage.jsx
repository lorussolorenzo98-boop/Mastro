import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import { useIsMobile } from '../hooks/useIsMobile'

const EMPTY_FORM = { category: 'idraulico', bio: '', city: '', hourlyRate: '' }

const categoryOptions = ['idraulico', 'elettricista', 'muratore', 'pulizie', 'giardinaggio']

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '7px',
  border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '13px',
  boxSizing: 'border-box', background: '#fff',
}

function AnnuncioForm({ form, setForm, onSave, onCancel, saveLabel, saveLoading, isMobile }) {
  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <div>
          <label style={{ fontSize: '11px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Categoria</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
            {categoryOptions.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '11px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Città</label>
          <input
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            required
            placeholder="Es. Milano"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Tariffa oraria (€)</label>
          <input
            type="number"
            value={form.hourlyRate}
            onChange={e => setForm({ ...form, hourlyRate: e.target.value })}
            required
            placeholder="Es. 45"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Bio</label>
          <input
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Descrivi il servizio..."
            style={inputStyle}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onSave}
          disabled={saveLoading}
          style={{ background: '#0e1e0e', color: '#c8f135', border: 'none', borderRadius: '7px', padding: '8px 18px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
          {saveLoading ? 'Salvataggio...' : saveLabel}
        </button>
        <button
          onClick={onCancel}
          style={{ background: 'transparent', color: '#5a6b5a', border: '0.5px solid rgba(26,46,26,0.18)', borderRadius: '7px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>
          Annulla
        </button>
      </div>
    </div>
  )
}

function DashboardProfessionistaPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const [bookings, setBookings] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editLoading, setEditLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_FORM)
  const [createLoading, setCreateLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchData()
  }, [token])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookingsRes, profRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/professional`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/professionals/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      setBookings(bookingsRes.data)
      setProfessionals(profRes.data)
    } catch (error) {
      if (error.response?.status === 404) navigate('/crea-profilo')
      console.error('Errore:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditStart = (pro) => {
    setEditingId(pro._id)
    setEditForm({ category: pro.category, bio: pro.bio || '', city: pro.city, hourlyRate: pro.hourlyRate })
    setShowCreateForm(false)
  }

  const handleEditSave = async (id) => {
    setEditLoading(true)
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/professionals/${id}`,
        { ...editForm, hourlyRate: Number(editForm.hourlyRate) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEditingId(null)
      showSuccess('Annuncio aggiornato!')
      fetchData()
    } catch (error) {
      console.error('Errore modifica:', error)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo annuncio?')) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/professionals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showSuccess('Annuncio eliminato.')
      fetchData()
    } catch (error) {
      console.error('Errore eliminazione:', error)
    }
  }

  const handleCreate = async () => {
    if (!createForm.city || !createForm.hourlyRate) return
    setCreateLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/professionals`,
        { ...createForm, hourlyRate: Number(createForm.hourlyRate) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowCreateForm(false)
      setCreateForm(EMPTY_FORM)
      showSuccess('Nuovo annuncio creato!')
      fetchData()
    } catch (error) {
      console.error('Errore creazione:', error)
    } finally {
      setCreateLoading(false)
    }
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchData()
    } catch (error) {
      console.error('Errore aggiornamento stato:', error)
    }
  }

  const filteredBookings = bookings.filter(b => activeTab === 'all' ? true : b.status === activeTab)

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

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '500', color: '#0e1e0e', marginBottom: '4px' }}>
            Dashboard professionista
          </h1>
          <p style={{ fontSize: '14px', color: '#5a6b5a', margin: 0 }}>
            Gestisci i tuoi annunci e le prenotazioni ricevute
          </p>
        </div>

        {/* I MIEI ANNUNCI */}
        <div style={{ background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)', borderRadius: '12px', padding: '18px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#0e1e0e' }}>
              I miei annunci ({professionals.length})
            </div>
            <button
              onClick={() => { setShowCreateForm(!showCreateForm); setEditingId(null) }}
              style={{ background: showCreateForm ? 'transparent' : '#0e1e0e', color: showCreateForm ? '#5a6b5a' : '#c8f135', border: showCreateForm ? '0.5px solid rgba(26,46,26,0.18)' : 'none', borderRadius: '7px', padding: '6px 14px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              {showCreateForm ? 'Annulla' : '+ Nuovo annuncio'}
            </button>
          </div>

          {successMsg && (
            <div style={{ background: '#E1F5EE', border: '0.5px solid #1D9E75', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#0F6E56', marginBottom: '14px' }}>
              {successMsg}
            </div>
          )}

          {showCreateForm && (
            <div style={{ background: '#f7f7f5', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#0e1e0e' }}>Nuovo annuncio</div>
              <AnnuncioForm
                form={createForm}
                setForm={setCreateForm}
                onSave={handleCreate}
                onCancel={() => { setShowCreateForm(false); setCreateForm(EMPTY_FORM) }}
                saveLabel="Crea annuncio"
                saveLoading={createLoading}
                isMobile={isMobile}
              />
            </div>
          )}

          {professionals.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#5a6b5a', margin: 0 }}>Nessun annuncio.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {professionals.map(pro => (
                <div key={pro._id} style={{ border: '0.5px solid rgba(26,46,26,0.12)', borderRadius: '8px', padding: '14px' }}>
                  {editingId === pro._id ? (
                    <AnnuncioForm
                      form={editForm}
                      setForm={setEditForm}
                      onSave={() => handleEditSave(pro._id)}
                      onCancel={() => setEditingId(null)}
                      saveLabel="Salva modifiche"
                      saveLoading={editLoading}
                      isMobile={isMobile}
                    />
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '10px', flex: 1, marginRight: '12px' }}>
                        {[
                          { label: 'Categoria', value: pro.category },
                          { label: 'Città',     value: pro.city },
                          { label: 'Tariffa',   value: `${pro.hourlyRate}€ / ora` },
                          { label: 'Bio',       value: pro.bio || '—' },
                        ].map(item => (
                          <div key={item.label}>
                            <div style={{ fontSize: '10px', color: '#5a6b5a', marginBottom: '2px' }}>{item.label}</div>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#0e1e0e', textTransform: item.label === 'Bio' ? 'none' : 'capitalize' }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => handleEditStart(pro)}
                          style={{ background: 'transparent', color: '#0e1e0e', border: '0.5px solid rgba(26,46,26,0.18)', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}>
                          Modifica
                        </button>
                        <button onClick={() => handleDelete(pro._id)}
                          style={{ background: 'transparent', color: '#A32D2D', border: '0.5px solid #A32D2D', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}>
                          Elimina
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* METRICHE */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {metrics.map(m => (
            <div key={m.label} style={{ background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)', borderLeft: `3px solid ${m.accent}`, borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '12px', color: '#5a6b5a', marginBottom: '6px' }}>{m.label}</div>
              <div style={{ fontSize: '26px', fontWeight: '500', color: '#0e1e0e' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(26,46,26,0.14)', marginBottom: '20px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: isMobile ? '10px 12px' : '10px 20px', fontSize: isMobile ? '13px' : '14px',
              border: 'none', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
              borderBottom: activeTab === tab.key ? '2px solid #0e1e0e' : '2px solid transparent',
              color: activeTab === tab.key ? '#0e1e0e' : '#5a6b5a',
              fontWeight: activeTab === tab.key ? '500' : '400',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* LISTA PRENOTAZIONI */}
        {loading ? (
          <p style={{ color: '#5a6b5a', padding: '40px 0', textAlign: 'center' }}>Caricamento...</p>
        ) : filteredBookings.length === 0 ? (
          <p style={{ color: '#5a6b5a', textAlign: 'center', padding: '60px 0' }}>Nessuna richiesta trovata.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredBookings.map(booking => (
              <div key={booking._id} style={{ background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)', borderRadius: '12px', padding: isMobile ? '14px' : '18px 20px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: '#0F6E56', flexShrink: 0, overflow: 'hidden' }}>
                      {booking.clientId?.avatar ? (
                        <img src={booking.clientId.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        `${booking.clientId?.firstname?.[0] || ''}${booking.clientId?.surname?.[0] || ''}`
                      )}
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