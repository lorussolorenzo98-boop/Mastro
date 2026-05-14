import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

function CheckoutForm({ professionalId, date, slot, amount }) {
  const stripe = useStripe()
  const elements = useElements()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await axios.post('${import.meta.env.VITE_API_URL}/api/payments/create-intent',
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      })

      if (result.error) {
        setError(result.error.message)
        setLoading(false)
        return
      }

      await axios.post('${import.meta.env.VITE_API_URL}/api/bookings',
        {
          professionalId,
          date,
          timeSlot: slot,
          description,
          address,
          amount,
          stripePaymentId: result.paymentIntent.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      navigate('/thank-you')

    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il pagamento')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Descrivi il lavoro</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required
          placeholder="Es. Perdita d'acqua sotto il lavandino della cucina..."
          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '14px', height: '80px', resize: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Indirizzo</label>
        <input value={address} onChange={e => setAddress(e.target.value)} required
          placeholder="Via e numero civico, Città"
          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '0.5px solid rgba(26,46,26,0.18)', fontSize: '14px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ height: '0.5px', background: 'rgba(26,46,26,0.1)', margin: '20px 0' }} />

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '8px' }}>Dati carta</label>
        <div style={{ padding: '12px', border: '0.5px solid rgba(26,46,26,0.18)', borderRadius: '6px', background: '#fff' }}>
          <CardElement options={{ style: { base: { fontSize: '14px' } } }} />
        </div>
        <p style={{ fontSize: '11px', color: '#5a6b5a', marginTop: '6px' }}>
          Usa la carta di test: <strong>4242 4242 4242 4242</strong> — scadenza qualsiasi — CVV qualsiasi
        </p>
      </div>

      {error && (
        <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595', borderRadius: '6px', padding: '12px', fontSize: '14px', color: '#A32D2D', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={!stripe || loading}
        style={{ width: '100%', background: '#c8f135', color: '#0e1e0e', border: 'none', borderRadius: '6px', padding: '13px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
        {loading ? 'Pagamento in corso...' : `Conferma e paga — ${amount}€`}
      </button>
    </form>
  )
}

function BookingPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const date = searchParams.get('date')
  const slot = searchParams.get('slot')
  const amount = Number(searchParams.get('amount'))

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ee', display: 'flex', flexDirection: 'column' }}>

      <div style={{
        flex: 1,
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        padding: isMobile ? '16px' : '24px',
      }}>

        <button onClick={() => navigate(-1)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', color: '#5a6b5a', border: 'none',
          background: 'transparent', cursor: 'pointer', padding: '0',
          marginBottom: '16px',
        }}>
          ← Torna al profilo
        </button>

        <h1 style={{
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: '500', color: '#0e1e0e', marginBottom: '16px',
        }}>
          Conferma prenotazione
        </h1>

        <div style={{
          background: '#E1F5EE', border: '0.5px solid #A8DFC8',
          borderRadius: '10px', padding: '16px', marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', color: '#0F6E56', fontWeight: '500', marginBottom: '4px' }}>
            {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div style={{ fontSize: '13px', color: '#3d6b3d', marginBottom: '8px' }}>
            Fascia oraria: {slot}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#0F6E56' }}>
            {amount}€
          </div>
        </div>

        <div style={{
          background: '#fff', border: '0.5px solid rgba(26,46,26,0.14)',
          borderRadius: '12px', padding: isMobile ? '16px' : '24px',
        }}>
          <Elements stripe={stripePromise}>
            <CheckoutForm professionalId={id} date={date} slot={slot} amount={amount} />
          </Elements>
        </div>

      </div>
    </div>
  )
}

export default BookingPage