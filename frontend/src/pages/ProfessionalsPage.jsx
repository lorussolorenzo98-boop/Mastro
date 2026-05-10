import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

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

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* FILTRI */}
      <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Categoria</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}>
            <option value="">Tutte</option>
            <option value="idraulico">Idraulico</option>
            <option value="elettricista">Elettricista</option>
            <option value="muratore">Muratore</option>
            <option value="pulizie">Pulizie</option>
            <option value="giardinaggio">Giardinaggio</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Città</label>
          <input type="text" placeholder="Es. Milano" value={filterCity} onChange={e => setFilterCity(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Tariffa min (€)</label>
          <input type="number" placeholder="0" value={filterMinRate} onChange={e => setFilterMinRate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '90px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Tariffa max (€)</label>
          <input type="number" placeholder="200" value={filterMaxRate} onChange={e => setFilterMaxRate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '90px' }} />
        </div>
        <button onClick={handleFilter}
          style={{ background: 'var(--green-dark)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
          Filtra
        </button>
      </div>

      {/* TITOLO */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--text)' }}>
          {loading ? 'Caricamento...' : `${professionals.length} professionisti trovati`}
        </h1>
      </div>

      {/* GRIGLIA */}
      {loading ? (
        <p>Caricamento...</p>
      ) : professionals.length === 0 ? (
        <p style={{ color: '#5a6b5a' }}>Nessun professionista trovato con questi filtri.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {professionals.map(pro => (
            <div key={pro._id}
              onClick={() => navigate(`/professionals/${pro._id}`)}
              style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '18px', cursor: 'pointer' }}>

              <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', marginBottom: '12px', background: 'var(--green-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pro.userId?.avatar ? (
                  <img src={pro.userId.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'var(--lime)', fontSize: '16px', fontWeight: '500' }}>
                    {pro.userId?.firstname?.[0]}{pro.userId?.surname?.[0]}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text)', marginBottom: '2px' }}>
                {pro.userId?.firstname} {pro.userId?.surname}
              </div>
              <div style={{ fontSize: '12px', color: '#5a6b5a', marginBottom: '10px' }}>
                {pro.category} · {pro.city}
              </div>
              <div style={{ fontSize: '12px', color: '#c8a000', marginBottom: '8px' }}>
                {'★'.repeat(Math.round(pro.rating))} {pro.rating} ({pro.reviewsCount} rec.)
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--green-dark)' }}>
                {pro.hourlyRate}€ <span style={{ fontWeight: '400', color: '#5a6b5a', fontSize: '12px' }}>/ ora</span>
              </div>

              <button style={{ marginTop: '12px', width: '100%', background: 'var(--green-dark)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '13px', cursor: 'pointer' }}>
                Vedi profilo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfessionalsPage