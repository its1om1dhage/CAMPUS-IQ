import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, ROLES } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import SubmitForm from "./pages/SubmitForm";
import SubmissionDetail from "./pages/SubmissionDetail";

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
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />

      {/* R&D Pages */}
      <Route path="/rd-submit" element={<ProtectedRoute><SubmitForm /></ProtectedRoute>} />
      <Route path="/submission/:id" element={<ProtectedRoute><SubmissionDetail /></ProtectedRoute>} />

      {/* These alias back to role dashboard for now */}
      {[
        "/rd-projects", "/rd-submissions", "/verify", "/team", "/pending",
        "/performance", "/profile", "/publications", "/patents", "/export",
        "/trends", "/reports", "/quality", "/accreditation", "/naac",
        "/departments", "/overview", "/planning", "/deadlines",
        "/users", "/database", "/permissions", "/config",
      ].map(path => (
        <Route key={path} path={path} element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
      ))}

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
