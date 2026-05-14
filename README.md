# Mastro 🔧

> Il marketplace italiano per trovare professionisti del settore domestico vicino a te.

🌐 **Live:** [https://mastro-eight.vercel.app](https://mastro-eight.vercel.app)

---

## 📋 Descrizione

Mastro è una piattaforma full-stack che connette clienti e professionisti del settore domestico (idraulici, elettricisti, muratori, addetti alle pulizie e giardinieri). I clienti possono cercare professionisti per categoria e città, prenotare un appuntamento e pagare online. I professionisti gestiscono le prenotazioni dalla propria dashboard.

---

## ✨ Funzionalità

**Clienti**
- 🔍 Ricerca professionisti per categoria, città e tariffa
- 📅 Prenotazione con selezione data e fascia oraria
- 💳 Pagamento sicuro con Stripe
- ⭐ Recensioni post-lavoro
- 📊 Dashboard prenotazioni personali

**Professionisti**
- 📝 Creazione e gestione di più annunci
- ✅ Conferma, rifiuto e completamento prenotazioni
- 📧 Notifiche email automatiche con SendGrid
- 📊 Dashboard con metriche e storico

**Generale**
- 🔐 Autenticazione JWT
- 🖼️ Upload foto profilo con Cloudinary
- 📱 Design responsive mobile-first

---

## 🛠️ Stack tecnologico

**Frontend**
- React + Vite
- React Router
- Axios
- Stripe.js
- Bootstrap

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Stripe API
- SendGrid
- Cloudinary

---

## 🚀 Come avviare il progetto in locale

### Prerequisiti
- Node.js 18+
- Account MongoDB Atlas
- Account Stripe (test mode)
- Account SendGrid
- Account Cloudinary

### Clona il repository
```bash
git clone https://github.com/lorussolorenzo98-boop/Mastro.git
cd Mastro
```

### Backend
```bash
cd backend
npm install
```

Crea il file `.env` nella cartella `backend/`:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_email
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
```

```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
```

Crea il file `.env` nella cartella `frontend/`:
```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

---

## 🌍 Deploy

- **Frontend:** Vercel → [https://mastro-eight.vercel.app](https://mastro-eight.vercel.app)
- **Backend:** Render → [https://mastro-jalw.onrender.com](https://mastro-jalw.onrender.com)

---

## 📁 Struttura del progetto

```
Mastro/
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   │   ├── User.js
│   │   ├── Professional.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── professionals.js
│   │   ├── bookings.js
│   │   ├── payments.js
│   │   ├── reviews.js
│   │   └── upload.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        └── pages/
```

---

## 🃏 Carta di test Stripe

Per testare i pagamenti usa:
```
Numero carta: 4242 4242 4242 4242
Scadenza: qualsiasi data futura
CVV: qualsiasi
```

---

## 👤 Autore  Lorenzo Maria Lorusso

Progetto sviluppato come Capstone Project per il corso Full Stack Developer di **Epicode**.
