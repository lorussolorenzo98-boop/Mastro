import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import { useIsMobile } from '../hooks/useIsMobile'

function ProfiloPage() {
  const { user, token, login } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    surname: user?.surname || '',
    email: user?.email || ''
  })

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = e => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveAvatar = async () => {
    setAvatarPreview(null)
    setAvatarFile(null)
    try {
      const res = await axios.put('${import.meta.env.VITE_API_URL}/api/auth/profile',
        { ...formData, avatar: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      login(token, res.data.user)
      setSuccess('Foto rimossa con successo')
    } catch (err) {
      setError('Errore nella rimozione della foto')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let avatarUrl = user?.avatar || ''

      if (avatarFile) {
        const formDataImg = new FormData()
        formDataImg.append('avatar', avatarFile)
        const uploadRes = await axios.post('${import.meta.env.VITE_API_URL}/api/upload/avatar', formDataImg, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        avatarUrl = uploadRes.data.url
      }

      const res = await axios.put('${import.meta.env.VITE_API_URL}/api/auth/profile',
        { ...formData, avatar: avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      login(token, res.data.user)
      setSuccess('Profilo aggiornato con successo!')
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '0.5px solid rgba(26,46,26,0.12)',
    fontSize: '14px',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, maxWidth: '600px', width: '100%', margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>

        <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '500', color: '#1a2e1a', marginBottom: '6px' }}>
          Il mio profilo
        </h1>
        <p style={{ fontSize: '14px', color: '#5a6b5a', marginBottom: '24px' }}>
          Gestisci le tue informazioni personali e la foto profilo
        </p>

        {success && (
          <div style={{ background: '#E1F5EE', border: '0.5px solid #1D9E75', borderRadius: '6px', padding: '12px', fontSize: '14px', color: '#0F6E56', marginBottom: '16px' }}>
            {success}
          </div>
        )}
        {error && (
          <div style={{ background: '#fff0f0', border: '0.5px solid #ffcccc', borderRadius: '6px', padding: '12px', fontSize: '14px', color: '#cc0000', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* FOTO */}
          <div style={{ background: '#fff', border: '0.5px solid rgba(26,46,26,0.12)', borderRadius: '12px', padding: isMobile ? '18px' : '24px', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a2e1a', marginBottom: '20px' }}>Foto profilo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '500', color: '#1a2e1a', overflow: 'hidden', flexShrink: 0 }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  `${user?.firstname?.[0]}${user?.surname?.[0] || ''}`
                )}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => document.getElementById('avatarInputProfilo').click()}
                    style={{ background: '#1a2e1a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>
                    Carica foto
                  </button>
                  {avatarPreview && (
                    <button type="button" onClick={handleRemoveAvatar}
                      style={{ background: 'transparent', color: '#cc0000', border: '0.5px solid #cc0000', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>
                      Rimuovi
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#5a6b5a', margin: 0 }}>JPG, PNG o WEBP · max 5MB</p>
              </div>
            </div>
            <input id="avatarInputProfilo" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </div>

          {/* DATI */}
          <div style={{ background: '#fff', border: '0.5px solid rgba(26,46,26,0.12)', borderRadius: '12px', padding: isMobile ? '18px' : '24px', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a2e1a', marginBottom: '20px' }}>Informazioni personali</div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div>
                <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Nome</label>
                <input name="firstname" value={formData.firstname} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Cognome</label>
                <input name="surname" value={formData.surname} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
            </div>

            <button type="submit" disabled={loading}
              style={{ background: '#c8f135', color: '#1a2e1a', border: 'none', borderRadius: '6px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
              {loading ? 'Salvataggio...' : 'Salva modifiche'}
            </button>
          </div>

        </form>

      </div>

      <Footer />

    </div>
  )
}

export default ProfiloPage