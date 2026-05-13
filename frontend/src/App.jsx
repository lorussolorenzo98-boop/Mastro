import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
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
        {/* Route pubbliche */}
        <Route path="/" element={<HomePage />} />
        <Route path="/professionals" element={<ProfessionalsPage />} />
        <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Route protette */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardClientePage /></ProtectedRoute>} />
        <Route path="/dashboard/professional" element={<ProtectedRoute><DashboardProfessionistPage /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/thank-you" element={<ProtectedRoute><ThankYouPage /></ProtectedRoute>} />
        <Route path="/crea-profilo" element={<ProtectedRoute><CreaProfiloPage /></ProtectedRoute>} />
        <Route path="/profilo" element={<ProtectedRoute><ProfiloPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App