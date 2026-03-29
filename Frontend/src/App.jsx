import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, ROLES } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";

// Role Dashboards
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import FacultyDashboard from "./pages/dashboards/FacultyDashboard";
import CoordinatorDashboard from "./pages/dashboards/CoordinatorDashboard";
import HODDashboard from "./pages/dashboards/HODDashboard";
import RDInchargeDashboard from "./pages/dashboards/RDInchargeDashboard";
import DeanDashboard from "./pages/dashboards/DeanDashboard";
import IQACDashboard from "./pages/dashboards/IQACDashboard";
import PrincipalDashboard from "./pages/dashboards/PrincipalDashboard";
import ManagementDashboard from "./pages/dashboards/ManagementDashboard";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";

// Role → Dashboard mapping
const DASHBOARD_MAP = {
  [ROLES.STUDENT]: <StudentDashboard />,
  [ROLES.FACULTY]: <FacultyDashboard />,
  [ROLES.BRANCH_COORDINATOR]: <CoordinatorDashboard />,
  [ROLES.BRANCH_HOD]: <HODDashboard />,
  [ROLES.RD_INCHARGE]: <RDInchargeDashboard />,
  [ROLES.DEAN_PD]: <DeanDashboard />,
  [ROLES.IQAC_INCHARGE]: <IQACDashboard />,
  [ROLES.PRINCIPAL]: <PrincipalDashboard />,
  [ROLES.COLLEGE_MANAGEMENT]: <ManagementDashboard />,
  [ROLES.SUPER_ADMIN]: <SuperAdminDashboard />,
};

function RoleDashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return DASHBOARD_MAP[user.role] || <Navigate to="/login" replace />;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      {/* All sub-pages fallback to dashboard for now */}
      <Route path="/rd-projects" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/rd-submit" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/rd-submissions" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/verify" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/pending" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/performance" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/publications" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/patents" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/export" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/trends" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/quality" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/accreditation" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/naac" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/overview" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/planning" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/deadlines" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/database" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/permissions" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      <Route path="/config" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      {/* Redirect root → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
