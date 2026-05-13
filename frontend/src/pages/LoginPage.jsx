import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', formData)
      login(res.data.token, res.data.user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Credenziali non valide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      height: 'calc(100vh - 60px)',
      overflow: 'hidden',
    }}>

      {/* SINISTRA — nascosta su mobile */}
      {!isMobile && (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80" alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(14,30,14,0.88) 0%, rgba(26,46,26,0.75) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '64px' }}>
            <div style={{ fontSize: '30px', fontWeight: '500', color: '#fff', lineHeight: '1.3', marginBottom: '14px' }}>
              Il professionista giusto,<br />
              <em style={{ color: '#c8f135', fontStyle: 'normal' }}>vicino a te</em>
            </div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '40px' }}>
              Prenota idraulici, elettricisti, muratori e molto altro — online, in pochi minuti.
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              {[
                { num: '500+', label: 'Professionisti' },
                { num: '4.8★', label: 'Valutazione media' },
                { num: '50+',  label: 'Città' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: '22px', fontWeight: '500', color: '#c8f135' }}>{s.num}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DESTRA */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '32px 24px' : '48px',
        overflowY: 'auto',
      }}>

        {isMobile && (
          <>
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(14,30,14,0.88) 0%, rgba(26,46,26,0.75) 100%)' }} />
          </>
        )}

        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '380px',
          background: isMobile ? 'rgba(255,255,255,0.95)' : '#fff',
          borderRadius: isMobile ? '16px' : '0',
          padding: isMobile ? '28px 24px' : '0',
        }}>
          <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '500', color: '#1a2e1a', marginBottom: '6px' }}>
            Bentornato
          </h1>
          <p style={{ fontSize: '14px', color: '#5a6b5a', marginBottom: '32px' }}>
            Non hai un account?{' '}
            <Link to="/register" style={{ color: '#1a2e1a', fontWeight: '500' }}>Registrati gratis</Link>
          </p>

          {error && (
            <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595', borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#A32D2D', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '5px' }}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required
                placeholder="la-tua@email.it"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.12)', fontSize: '14px', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '5px' }}>Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} required
                placeholder="••••••••"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.12)', fontSize: '14px', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: '#c8f135', color: '#1a2e1a', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
              {loading ? 'Accesso...' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default LoginPage