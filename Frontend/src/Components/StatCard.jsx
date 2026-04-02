// StatCard.jsx — supports loading skeleton + trend
export function StatCard({ label, value, icon: Icon, color = "blue", trend, subtext, loading }) {
  if (loading) {
    return (
      <div className={`stat-card ${color}`}>
        <div style={{ flex: 1 }}>
          <div className="skeleton-line" style={{ width: "60%", marginBottom: 12 }} />
          <div className="skeleton-line" style={{ width: "40%", height: 28 }} />
        </div>
        <div className={`stat-icon ${color}`} style={{ opacity: 0.3 }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
    );
  }

  return (
    <div className={`stat-card ${color}`}>
      <div style={{ flex: 1 }}>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trend !== undefined && (
          <div className={`stat-trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last month
          </div>
        )}
        {subtext && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{subtext}</div>}
      </div>
      {Icon && (
        <div className={`stat-icon ${color}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}

export function StatCardGrid({ children }) {
  return <div className="stats-grid">{children}</div>;
}
