import { Bell, Search, HelpCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopHeader({ title, subtitle }) {
  const { user } = useAuth();
  const initials = user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "?";

  return (
    <header className="top-header">
      <div className="header-title-block">
        <div className="header-page-title">{title}</div>
        {subtitle && <div className="header-breadcrumb">{subtitle}</div>}
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input type="text" placeholder="Search..." />
        </div>

        <button className="header-btn" title="Help">
          <HelpCircle size={16} />
        </button>

        <button className="header-btn" title="Notifications">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>

        <div className="header-avatar" title={user?.name}>
          {initials}
        </div>
      </div>
    </header>
  );
}
