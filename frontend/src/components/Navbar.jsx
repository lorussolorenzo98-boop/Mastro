import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ background: 'var(--green-dark)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      
      <Link to="/" style={{ fontSize: '22px', fontWeight: '500', color: '#fff', textDecoration: 'none' }}>
        Mastr<span style={{ color: 'var(--lime)' }}>o</span>
      </Link>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link to="/professionals" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
          Trova professionisti
        </Link>
        <Link to="/login" style={{ background: '#fff', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '8px 18px', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
          Accedi
        </Link>
        <Link to="/register" style={{ background: 'var(--lime)', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '8px 18px', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
          Registrati
        </Link>
      </div>

    </nav>
  )
}

export default Navbar