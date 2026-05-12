import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [formData, setFormData] = useState({ firstname: '', surname: '', email: '', password: '', role: 'client' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let avatarUrl = ''
      if (avatarFile) {
        const formDataImg = new FormData()
        formDataImg.append('avatar', avatarFile)
        const uploadRes = await axios.post('http://localhost:3000/api/upload/avatar', formDataImg, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        avatarUrl = uploadRes.data.url
      }
      const res = await axios.post('http://localhost:3000/api/auth/register', { ...formData, avatar: avatarUrl })
      login(res.data.token, res.data.user)
      navigate(formData.role === 'professional' ? '/crea-profilo' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la registrazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>

      {/* SINISTRA */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(14,30,14,0.88) 0%, rgba(26,46,26,0.75) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '64px' }}>
          <div style={{ fontSize: '30px', fontWeight: '500', color: '#fff', lineHeight: '1.3', marginBottom: '14px' }}>
            Unisciti a <em style={{ color: '#c8f135', fontStyle: 'normal' }}>Mastro</em><br />oggi stesso
          </div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '40px' }}>
            Trova professionisti di fiducia o inizia a ricevere prenotazioni nella tua zona.
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { num: '500+', label: 'Professionisti' },
              { num: '2.400+', label: 'Prenotazioni' },
              { num: '50+', label: 'Città' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '22px', fontWeight: '500', color: '#c8f135' }}>{s.num}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESTRA */}
      <div style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '500', color: '#1a2e1a', marginBottom: '6px' }}>Crea un account</h1>
          <p style={{ fontSize: '14px', color: '#5a6b5a', marginBottom: '24px' }}>
            Hai già un account?{' '}
            <Link to="/login" style={{ color: '#1a2e1a', fontWeight: '500' }}>Accedi</Link>
          </p>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#cc0000', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div onClick={() => document.getElementById('avatarInputReg').click()}
                style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#e1f5ee', border: '2px dashed #1a2e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', cursor: 'pointer', overflow: 'hidden' }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '13px', color: '#5a6b5a' }}>+ Foto</span>
                )}
              </div>
              <input id="avatarInputReg" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              <p style={{ fontSize: '12px', color: '#5a6b5a' }}>Opzionale</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '5px' }}>Nome</label>
                <input name="firstname" value={formData.firstname} onChange={handleChange} required placeholder="Mario"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.12)', fontSize: '14px', outline: 'none', background: '#fafafa' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '5px' }}>Cognome</label>
                <input name="surname" value={formData.surname} onChange={handleChange} required placeholder="Rossi"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.12)', fontSize: '14px', outline: 'none', background: '#fafafa' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '5px' }}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="la-tua@email.it"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.12)', fontSize: '14px', outline: 'none', background: '#fafafa' }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '5px' }}>Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.12)', fontSize: '14px', outline: 'none', background: '#fafafa' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '5px' }}>Sei un</label>
              <select name="role" value={formData.role} onChange={handleChange}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.12)', fontSize: '14px', outline: 'none', background: '#fafafa' }}>
                <option value="client">Cliente — cerco professionisti</option>
                <option value="professional">Professionista — offro servizi</option>
              </select>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: '#c8f135', color: '#1a2e1a', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
              {loading ? 'Registrazione...' : 'Registrati'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage