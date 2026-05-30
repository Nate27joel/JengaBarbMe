import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Discovery } from './pages/Discovery';
import { Barbers } from './pages/Barbers';
import { Offers } from './pages/Offers';
import { Auth } from './pages/Auth';
import { ProfessionalDashboard } from './pages/ProfessionalDashboard';
import { ProfessionalServices } from './pages/ProfessionalServices';
import { ClientDashboard } from './pages/ClientDashboard';
import { About } from './pages/About';
import { Safety } from './pages/Safety';
import { Support } from './pages/Support';
import { ProLanding } from './pages/ProLanding';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discovery />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pro" element={<ProLanding />} />
                <Route path="/pro/dashboard" element={<ProfessionalDashboard />} />
                <Route path="/pro/services" element={<ProfessionalServices />} />
                <Route path="/about" element={<About />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/support" element={<Support />} />
                <Route path="/client/dashboard" element={<ClientDashboard />} />
                <Route path="/barbers" element={<Barbers />} />
                <Route path="/offers" element={<Offers />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}
