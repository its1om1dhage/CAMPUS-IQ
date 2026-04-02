import { Bell, Search, Sun, RefreshCw, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopHeader({ title, subtitle, pendingCount = 0, onSearch, searchValue, onRefresh, onToggleSidebar }) {
  const { user } = useAuth();
  const initials = user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "?";

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="header-btn mobile-menu-btn" onClick={onToggleSidebar} title="Menu">
          <Menu size={18} />
        </button>
        <div className="header-title-block">
          <div className="header-page-title">{title}</div>
          {subtitle && <div className="header-breadcrumb">{subtitle}</div>}
        </div>
      </div>

      <div className="header-actions">
        {onSearch !== undefined && (
          <div className="header-search">
            <Search size={14} style={{ color: "var(--text-muted)" }} />
            <input
              placeholder="Quick search..."
              value={searchValue || ""}
              onChange={e => onSearch(e.target.value)}
            />
          </div>
        )}

        {onRefresh && (
          <button className="header-btn" onClick={onRefresh} title="Refresh">
            <RefreshCw size={15} />
          </button>
        )}

        <button className="header-btn" title="Notifications">
          <Bell size={15} />
          {pendingCount > 0 && (
            <span className="notif-dot" style={{ fontSize: 8, minWidth: 16, height: 16, borderRadius: 99, position: "absolute", top: -4, right: -4, background: "var(--danger)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", fontWeight: 700 }}>
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </button>

        <div className="header-avatar" title={user?.name}>{initials}</div>
      </div>
    </header>
  );
}
