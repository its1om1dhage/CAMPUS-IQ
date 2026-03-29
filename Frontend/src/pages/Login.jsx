import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLE_CONFIG, ROLES } from "../context/AuthContext";
import { ArrowRight, Zap } from "lucide-react";

const ROLE_ORDER = [
  ROLES.STUDENT,
  ROLES.FACULTY,
  ROLES.BRANCH_COORDINATOR,
  ROLES.BRANCH_HOD,
  ROLES.RD_INCHARGE,
  ROLES.DEAN_PD,
  ROLES.IQAC_INCHARGE,
  ROLES.PRINCIPAL,
  ROLES.COLLEGE_MANAGEMENT,
  ROLES.SUPER_ADMIN,
];

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    login(selectedRole);
    navigate("/dashboard");
  };

  const handleQuickLogin = async (role) => {
    setSelectedRole(role);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    login(role);
    navigate("/dashboard");
  };

  const cfg = ROLE_CONFIG[selectedRole];

  return (
    <div className="login-bg">
      <div className="login-grid-bg" />

      <div style={{ width: "100%", maxWidth: 900, display: "flex", gap: 40, alignItems: "center", position: "relative", zIndex: 10 }}>

        {/* Left Panel */}
        <div style={{ flex: 1, display: "none" }} className="hide-mobile">
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 40, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
              CAMPUS<span style={{ color: "var(--primary-light)" }}>-IQ</span>
            </div>
            <div style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 10 }}>
              Smart College Management System
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 32 }}>
            {[
              { icon: "🔬", title: "R&D Tracking", desc: "Centralized research data management" },
              { icon: "📊", title: "Role-Based Access", desc: "10 roles with granular permissions" },
              { icon: "✅", title: "Verification Pipeline", desc: "Multi-level data verification" },
              { icon: "📈", title: "Accreditation Reports", desc: "NAAC, NBA ready analytics" },
            ].map(f => (
              <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <span style={{ fontSize: 24, lineHeight: 1 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card" style={{ maxWidth: 480, width: "100%" }}>
          <div className="login-logo">
            <div className="login-logo-icon">IQ</div>
            <div>
              <div className="login-brand-name">CAMPUS-IQ</div>
              <div className="login-brand-sub">Centralized College System · v1.0</div>
            </div>
          </div>

          <div className="login-title">Welcome Back</div>
          <div className="login-subtitle">Select your role to sign in to your dashboard</div>

          {/* Quick Login Tip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
            background: "rgba(79,70,229,0.08)", border: "1px solid var(--border-accent)",
            borderRadius: "var(--radius-md)", marginBottom: 16, fontSize: 12, color: "var(--text-accent)"
          }}>
            <Zap size={13} />
            <span><strong>Quick Login:</strong> Click any role below to instantly access its dashboard</span>
          </div>

          {/* Role Grid */}
          <div className="login-role-grid">
            {ROLE_ORDER.map(role => {
              const c = ROLE_CONFIG[role];
              return (
                <div
                  key={role}
                  className={`role-chip ${selectedRole === role ? "selected" : ""}`}
                  onClick={() => handleQuickLogin(role)}
                >
                  <span className="role-chip-icon">{c.icon}</span>
                  <span style={{ lineHeight: 1.2 }}>{c.label}</span>
                </div>
              );
            })}
          </div>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">OR SIGN IN WITH CREDENTIALS</span>
            <div className="login-divider-line" />
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Employee / Student ID</label>
              <input className="form-input" type="text" defaultValue={cfg?.id || ""} placeholder="Enter your ID" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" defaultValue="demo1234" placeholder="Enter your password" required />
            </div>
            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="spin" style={{ display: "inline-block" }}>⟳</span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
            © 2026 CAMPUS-IQ — For internal institutional use only
          </div>
        </div>
      </div>
    </div>
  );
}