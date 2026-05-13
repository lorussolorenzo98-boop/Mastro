import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'

function CreaProfiloPage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    category: '',
    bio: '',
    city: '',
    hourlyRate: ''
  })

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    if (user?.role !== 'professional') { navigate('/'); return }

    const checkProfile = async () => {
      try {
        await axios.get('http://localhost:3000/api/professionals/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        navigate('/dashboard/professional')
      } catch {
        // non ha profilo, rimani qui
      }
    }
    checkProfile()
  }, [token])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post('http://localhost:3000/api/professionals',
        { ...formData, hourlyRate: Number(formData.hourlyRate) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      navigate('/dashboard/professional')
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la creazione del profilo')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '0.5px solid rgba(26,46,26,0.18)',
    fontSize: '14px',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '16px' : '24px' }}>

      <div style={{
        background: '#fff',
        border: '0.5px solid rgba(26,46,26,0.14)',
        borderRadius: '12px',
        padding: isMobile ? '20px' : '32px',
        width: '100%',
        maxWidth: '480px',
      }}>

        <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '500', color: '#0e1e0e', marginBottom: '8px' }}>
          Crea il tuo primo annuncio
        </h1>
        <p style={{ fontSize: '14px', color: '#5a6b5a', marginBottom: '24px' }}>
          Inserisci i dettagli del servizio che offri per iniziare a ricevere prenotazioni
        </p>

        {error && (
          <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595', borderRadius: '6px', padding: '12px', fontSize: '14px', color: '#A32D2D', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Categoria</label>
            <select name="category" value={formData.category} onChange={handleChange} required style={inputStyle}>
              <option value="">Seleziona una categoria</option>
              <option value="idraulico">Idraulico</option>
              <option value="elettricista">Elettricista</option>
              <option value="muratore">Muratore</option>
              <option value="pulizie">Pulizie</option>
              <option value="giardinaggio">Giardinaggio</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Città</label>
            <input name="city" value={formData.city} onChange={handleChange} required
              placeholder="Es. Milano" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Tariffa oraria (€)</label>
            <input name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleChange} required
              placeholder="Es. 45" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} required
              placeholder="Descrivi la tua esperienza e i servizi che offri..."
              style={{ ...inputStyle, height: '100px', resize: 'none' }} />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#c8f135', color: '#0e1e0e', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
            {loading ? 'Salvataggio...' : 'Crea annuncio'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default CreaProfiloPage