import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        employee_id: employeeId,
        password: password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  // Modern, Elegant Styles
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundDecor: {
      position: 'absolute',
      width: '500px',
      height: '500px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      filter: 'blur(80px)',
    },
    decor1: {
      top: '-150px',
      left: '-150px',
    },
    decor2: {
      bottom: '-150px',
      right: '-150px',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '48px 40px',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      width: '100%',
      maxWidth: '440px',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10,
      backdropFilter: 'blur(10px)',
      animation: 'slideUp 0.6s ease-out'
    },
    logoContainer: {
      marginBottom: '24px'
    },
    logo: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      fontSize: '32px',
      color: '#ffffff',
      fontWeight: '700',
      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '8px',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: '15px',
      color: '#6b7280',
      marginBottom: '36px',
      fontWeight: '400'
    },
    errorBox: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      padding: '14px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      marginBottom: '24px',
      border: '1px solid #fecaca',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'shake 0.5s ease'
    },
    formGroup: {
      marginBottom: '24px',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
      letterSpacing: '0.3px'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '15px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#f9fafb',
      fontWeight: '400'
    },
    inputFocused: {
      border: '2px solid #667eea',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
    },
    button: {
      width: '100%',
      padding: '14px',
      background: isHovering 
        ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
      transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
      letterSpacing: '0.5px'
    },
    footer: {
      marginTop: '28px',
      fontSize: '13px',
      color: '#9ca3af'
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{...styles.backgroundDecor, ...styles.decor1}}></div>
      <div style={{...styles.backgroundDecor, ...styles.decor2}}></div>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
          
          input::placeholder {
            color: #9ca3af;
            font-weight: 400;
          }
        `}
      </style>
      
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>CI</div>
        </div>
        
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to access your Campus IQ account</p>

        {error && (
          <div style={styles.errorBox}>
            <span style={{fontSize: '18px'}}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Employee ID</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Enter your employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onFocus={() => setFocusedInput('employeeId')}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.input,
                  ...(focusedInput === 'employeeId' ? styles.inputFocused : {})
                }}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.input,
                  ...(focusedInput === 'password' ? styles.inputFocused : {})
                }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Sign In →
          </button>
        </form>

        <div style={styles.footer}>
          <span>Need help? </span>
          <a style={styles.link}>Contact Support</a>
        </div>
      </div>
    </div>
  );
}