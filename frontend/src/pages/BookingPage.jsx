import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

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
      // 1. Crea il Payment Intent sul backend
      const { data } = await axios.post('http://localhost:3000/api/payments/create-intent',
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // 2. Conferma il pagamento con Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      })

      if (result.error) {
        setError(result.error.message)
        setLoading(false)
        return
      }

      // 3. Crea la prenotazione nel db
      await axios.post('http://localhost:3000/api/bookings',
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
          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', height: '80px', resize: 'none' }} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '4px' }}>Indirizzo</label>
        <input value={address} onChange={e => setAddress(e.target.value)} required
          placeholder="Via e numero civico, Città"
          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
      </div>

      <div style={{ height: '1px', background: '#eee', margin: '20px 0' }} />

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', color: '#5a6b5a', display: 'block', marginBottom: '8px' }}>Dati carta</label>
        <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' }}>
          <CardElement options={{ style: { base: { fontSize: '14px' } } }} />
        </div>
        <p style={{ fontSize: '11px', color: '#5a6b5a', marginTop: '6px' }}>
          Usa la carta di test: <strong>4242 4242 4242 4242</strong> — scadenza qualsiasi — CVV qualsiasi
        </p>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '6px', padding: '12px', fontSize: '14px', color: '#cc0000', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={!stripe || loading}
        style={{ width: '100%', background: 'var(--lime)', color: 'var(--green-dark)', border: 'none', borderRadius: '6px', padding: '13px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
        {loading ? 'Pagamento in corso...' : `Conferma e paga — ${amount}€`}
      </button>
    </form>
  )
}

function BookingPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const date = searchParams.get('date')
  const slot = searchParams.get('slot')
  const amount = 45 // per ora fisso, poi lo prendiamo dal professionista

  return (
    <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>Conferma prenotazione</h1>

      <div style={{ background: '#E1F5EE', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', color: '#0F6E56', fontWeight: '500', marginBottom: '4px' }}>
          {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div style={{ fontSize: '13px', color: '#3d6b3d' }}>Fascia oraria: {slot}</div>
        <div style={{ fontSize: '16px', fontWeight: '500', color: '#0F6E56', marginTop: '8px' }}>{amount}€</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.12)', borderRadius: '10px', padding: '24px' }}>
        <Elements stripe={stripePromise}>
          <CheckoutForm professionalId={id} date={date} slot={slot} amount={amount} />
        </Elements>
      </div>
    </div>
  )
}

export default BookingPage