import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    email: '',
    password: '',
    role: 'client'
  })
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

      const res = await axios.post('http://localhost:3000/api/auth/register', {
        ...formData,
        avatar: avatarUrl
      })

      login(res.data.token, res.data.user)

      if (formData.role === 'professional') {
        navigate('/crea-profilo')
      } else {
        navigate('/')
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la registrazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '32px', width: '100%', maxWidth: '440px' }}>

        <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>Crea un account</h1>
        <p style={{ fontSize: '14px', color: '#5a6b5a', marginBottom: '24px' }}>
          Hai già un account? <Link to="/login" style={{ color: 'var(--green-dark)', fontWeight: '500' }}>Accedi</Link>
        </p>

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '6px', padding: '12px', fontSize: '14px', color: '#cc0000', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* FOTO PROFILO */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div
              onClick={() => document.getElementById('avatarInputReg').click()}
              style={{ width: '80px', height: '80px', borderRadius: '50%', background: avatarPreview ? 'transparent' : '#E1F5EE', border: '2px dashed #1a2e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', cursor: 'pointer', overflow: 'hidden' }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '11px', color: '#5a6b5a' }}>+ Foto</span>
              )}
            </div>
            <input id="avatarInputReg" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            <p style={{ fontSize: '11px', color: '#5a6b5a' }}>Opzionale</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Nome</label>
              <input name="firstname" value={formData.firstname} onChange={handleChange} required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Cognome</label>
              <input name="surname" value={formData.surname} onChange={handleChange} required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Sei un</label>
            <select name="role" value={formData.role} onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}>
              <option value="client">Cliente — cerco professionisti</option>
              <option value="professional">Professionista — offro servizi</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'var(--lime)', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
            {loading ? 'Registrazione...' : 'Registrati'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage