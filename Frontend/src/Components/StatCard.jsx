import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function StatCard({ label, value, icon: Icon, color = "blue", trend, trendLabel }) {
  const trendEl = trend !== undefined
    ? trend > 0
      ? <span className="stat-trend up"><TrendingUp size={11} style={{display:'inline',marginRight:3}} />+{trend}% {trendLabel || "vs last month"}</span>
      : trend < 0
      ? <span className="stat-trend down"><TrendingDown size={11} style={{display:'inline',marginRight:3}} />{trend}% {trendLabel || "vs last month"}</span>
      : <span className="stat-trend" style={{color:"var(--text-muted)"}}><Minus size={11} style={{display:'inline',marginRight:3}} />No change</span>
    : null;

  return (
    <div className={`stat-card ${color}`}>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trendEl && <div className="mt-1">{trendEl}</div>}
      </div>
      {Icon && (
        <div className={`stat-icon ${color}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}

export function StatCardGrid({ children }) {
  return <div className="stats-grid">{children}</div>;
}
