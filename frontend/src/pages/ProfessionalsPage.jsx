import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Footer from '../components/Footer'

function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const category = searchParams.get('category') || ''
  const city = searchParams.get('city') || ''

  const [filterCategory, setFilterCategory] = useState(category)
  const [filterCity, setFilterCity] = useState(city)
  const [filterMinRate, setFilterMinRate] = useState('')
  const [filterMaxRate, setFilterMaxRate] = useState('')

  useEffect(() => {
    fetchProfessionals()
  }, [searchParams])

  const fetchProfessionals = async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchParams.get('category')) params.category = searchParams.get('category')
      if (searchParams.get('city')) params.city = searchParams.get('city')
      if (filterMinRate) params.minRate = filterMinRate
      if (filterMaxRate) params.maxRate = filterMaxRate

      const res = await axios.get('http://localhost:3000/api/professionals', { params })
      setProfessionals(res.data)
    } catch (error) {
      console.error('Errore nel caricamento professionisti:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    setSearchParams({ category: filterCategory, city: filterCity })
  }

  const getInitials = (firstname = '', surname = '') =>
    `${firstname.charAt(0)}${surname.charAt(0)}`.toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '24px' }}>

        {/* FILTRI */}
        <div style={{
          background: '#fff',
          border: '0.5px solid rgba(26,46,26,0.14)',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}>
          <div>
            <label style={{ fontSize: '11px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Categoria</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '13px', background: '#fff', color: '#0e1e0e' }}>
              <option value="">Tutte</option>
              <option value="idraulico">Idraulico</option>
              <option value="elettricista">Elettricista</option>
              <option value="muratore">Muratore</option>
              <option value="pulizie">Pulizie</option>
              <option value="giardinaggio">Giardinaggio</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Città</label>
            <input type="text" placeholder="Es. Milano" value={filterCity} onChange={e => setFilterCity(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '13px', width: '140px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Tariffa min (€)</label>
            <input type="number" placeholder="0" value={filterMinRate} onChange={e => setFilterMinRate(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '13px', width: '80px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Tariffa max (€)</label>
            <input type="number" placeholder="200" value={filterMaxRate} onChange={e => setFilterMaxRate(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '13px', width: '80px' }} />
          </div>
          <button onClick={handleFilter}
            style={{ background: '#0e1e0e', color: '#c8f135', border: 'none', borderRadius: '6px', padding: '8px 20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            Filtra
          </button>
        </div>

        {/* TITOLO */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '16px', fontWeight: '500', color: '#0e1e0e' }}>
            {loading ? 'Caricamento...' : `${professionals.length} professionisti trovati`}
          </h1>
        </div>

        {/* GRIGLIA */}
        {loading ? (
          <p style={{ color: '#5a6b5a' }}>Caricamento...</p>
        ) : professionals.length === 0 ? (
          <p style={{ color: '#5a6b5a' }}>Nessun professionista trovato con questi filtri.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {professionals.map(pro => (
              <div key={pro._id}
                onClick={() => navigate(`/professionals/${pro._id}`)}
                style={{
                  background: '#fff',
                  border: '0.5px solid rgba(26,46,26,0.14)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  cursor: 'pointer',
                  height: '148px',
                }}>

                {/* SINISTRA */}
                {pro.userId?.avatar ? (
                  <div style={{ width: '120px', minWidth: '120px', overflow: 'hidden' }}>
                    <img
                      src={pro.userId.avatar}
                      alt={`${pro.userId?.firstname} ${pro.userId?.surname}`}
                      style={{ width: '120px', height: '148px', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '120px', minWidth: '120px',
                    background: '#0e1e0e',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '8px', padding: '16px 10px',
                  }}>
                    <div style={{
                      width: '58px', height: '58px', borderRadius: '50%',
                      background: '#1a2e1a',
                      border: '1.5px solid rgba(200,241,53,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', fontWeight: '500', color: '#c8f135',
                    }}>
                      {getInitials(pro.userId?.firstname, pro.userId?.surname)}
                    </div>
                    <div style={{
                      background: 'rgba(200,241,53,0.1)', color: '#c8f135',
                      fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                      textTransform: 'capitalize', textAlign: 'center',
                    }}>
                      {pro.category}
                    </div>
                  </div>
                )}

                {/* DESTRA */}
                <div style={{
                  flex: 1, padding: '14px 16px',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', minWidth: 0,
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#0e1e0e', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pro.userId?.firstname} {pro.userId?.surname}
                    </div>
                    <div style={{ fontSize: '11px', color: '#5a6b5a', marginBottom: '2px', textTransform: 'capitalize' }}>
                      {pro.category} · {pro.city}
                    </div>
                    {pro.userId?.avatar && (
                      <div style={{
                        background: 'rgba(26,46,26,0.06)', color: '#3B6D11',
                        fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                        display: 'inline-block', marginBottom: '6px', textTransform: 'capitalize',
                      }}>
                        {pro.category}
                      </div>
                    )}
                    {pro.bio && (
                      <div style={{
                        fontSize: '11px', color: '#5a6b5a', lineHeight: '1.5',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {pro.bio}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#BA7517', marginBottom: '2px' }}>
                        {'★'.repeat(Math.round(pro.rating))} {pro.rating} ({pro.reviewsCount} rec.)
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '500', color: '#0e1e0e' }}>
                        {pro.hourlyRate}€ <span style={{ fontSize: '11px', fontWeight: '400', color: '#5a6b5a' }}>/ ora</span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/professionals/${pro._id}`) }}
                      style={{
                        background: '#0e1e0e', color: '#c8f135',
                        border: 'none', borderRadius: '6px',
                        padding: '6px 14px', fontSize: '12px',
                        fontWeight: '500', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}>
                      Vedi profilo
                    </button>
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

export default ProfessionalsPage