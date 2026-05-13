import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  return (
    <nav style={{ background: '#1a2e1a', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

      <Link to="/" style={{ fontSize: '22px', fontWeight: '500', color: '#fff', textDecoration: 'none' }}>
        Mastr<span style={{ color: '#c8f135' }}>o</span>
      </Link>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

        {!isMobile && (
          <Link to="/professionals" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
            Trova professionisti
          </Link>
        )}

        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: '#1a2e1a', overflow: 'hidden', flexShrink: 0 }}>
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  `${user.firstname?.[0]}${user.lastname?.[0] || ''}`
                )}
              </div>
              {!isMobile && (
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                  {user.firstname}
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>▾</span>
            </button>

            {dropdownOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '0.5px solid rgba(26,46,26,0.12)', borderRadius: '10px', width: '220px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', zIndex: 100 }}>
                <div style={{ padding: '16px', borderBottom: '0.5px solid rgba(26,46,26,0.12)' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a2e1a' }}>{user.firstname}</div>
                  <div style={{ fontSize: '12px', color: '#5a6b5a', marginTop: '2px' }}>{user.email}</div>
                </div>

                {isMobile && (
                  <div
                    onClick={() => { navigate('/professionals'); setDropdownOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', fontSize: '14px', color: '#1a2e1a', cursor: 'pointer', borderBottom: '0.5px solid rgba(26,46,26,0.06)' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7f7f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    Trova professionisti
                  </div>
                )}

                <div
                  onClick={() => { navigate(user.role === 'professional' ? '/dashboard/professional' : '/dashboard'); setDropdownOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', fontSize: '14px', color: '#1a2e1a', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f7f7f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Dashboard
                </div>

                <div
                  onClick={() => { navigate('/profilo'); setDropdownOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', fontSize: '14px', color: '#1a2e1a', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f7f7f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Il mio profilo
                </div>

                <div style={{ height: '0.5px', background: 'rgba(26,46,26,0.12)' }} />

                <div
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', fontSize: '14px', color: '#cc0000', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Esci
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" style={{ background: '#fff', color: '#1a2e1a', borderRadius: '6px', padding: isMobile ? '7px 10px' : '8px 14px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500', textDecoration: 'none' }}>
              Accedi
            </Link>
            <Link to="/register" style={{ background: '#c8f135', color: '#1a2e1a', borderRadius: '6px', padding: isMobile ? '7px 10px' : '8px 14px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500', textDecoration: 'none' }}>
              Registrati
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar