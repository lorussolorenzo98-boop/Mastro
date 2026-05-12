import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProfessionalsPage from './pages/ProfessionalsPage'
import ProfessionalDetailPage from './pages/ProfessionalDetailPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardClientePage from './pages/DashboardClientePage'
import BookingPage from './pages/BookingPage'
import ThankYouPage from './pages/ThankYouPage'
import DashboardProfessionistPage from './pages/DashboardProfessionistPage'
import CreaProfiloPage from './pages/CreaProfiloPage'
import ProfiloPage from './pages/ProfiloPage'



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/professionals" element={<ProfessionalsPage />} />
        <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardClientePage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/dashboard/professional" element={<DashboardProfessionistPage />} />
        <Route path="/crea-profilo" element={<CreaProfiloPage />} />
        <Route path="/profilo" element={<ProfiloPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App