import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import CitizenLayout from './layouts/CitizenLayout';
import OfficerLayout from './layouts/OfficerLayout';

// Pages
import Login from './pages/Login';
import CitizenHome from './pages/citizen/CitizenHome';
import CitizenReportReview from './pages/citizen/CitizenReportReview';
import CitizenReports from './pages/citizen/CitizenReports';
import CitizenProfile from './pages/citizen/CitizenProfile';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerHotspots from './pages/officer/OfficerHotspots';
import OfficerClusterDetail from './pages/officer/OfficerClusterDetail';
import OfficerReports from './pages/officer/OfficerReports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Citizen Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CITIZEN']} />}>
            <Route element={<CitizenLayout />}>
              <Route path="/citizen" element={<CitizenHome />} />
              <Route path="/citizen/report/review" element={<CitizenReportReview />} />
              <Route path="/citizen/reports" element={<CitizenReports />} />
              <Route path="/citizen/profile" element={<CitizenProfile />} />
            </Route>
          </Route>

          {/* Officer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['OFFICER']} />}>
            <Route element={<OfficerLayout />}>
              <Route path="/officer" element={<OfficerDashboard />} />
              <Route path="/officer/hotspots" element={<OfficerHotspots />} />
              <Route path="/officer/clusters/:id" element={<OfficerClusterDetail />} />
              <Route path="/officer/reports" element={<OfficerReports />} />
              <Route path="/officer/priority" element={<OfficerHotspots />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
