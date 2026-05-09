import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{ background: 'var(--green-dark)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

      <Link to="/" style={{ fontSize: '22px', fontWeight: '500', color: '#fff', textDecoration: 'none' }}>
        Mastr<span style={{ color: 'var(--lime)' }}>o</span>
      </Link>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link to="/professionals" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
          Trova professionisti
        </Link>

        {user ? (
          <>
            <Link
              to={user.role === 'professional' ? '/dashboard/professional' : '/dashboard'}
              style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
              Ciao, {user.firstname}
            </span>
            <button onClick={handleLogout}
              style={{ background: '#fff', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '8px 18px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Esci
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ background: '#fff', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '8px 18px', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
              Accedi
            </Link>
            <Link to="/register" style={{ background: 'var(--lime)', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '8px 18px', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
              Registrati
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar