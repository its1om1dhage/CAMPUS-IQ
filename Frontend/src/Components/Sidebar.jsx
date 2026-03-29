import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, FlaskConical, FileText, BarChart3,
  Users, Settings, Bell, LogOut, Layers,
  BookOpen, ClipboardList, CheckSquare, TrendingUp,
  Database, Shield, Building2, GraduationCap,
  ChevronRight, Award, Calendar, Download,
} from "lucide-react";

const NAV_CONFIG = {
  student: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: GraduationCap, label: "My Profile", path: "/profile" },
    ]},
    { section: "R&D", items: [
      { icon: FlaskConical, label: "My Projects", path: "/rd-projects", badge: null },
      { icon: FileText, label: "Submit Work", path: "/rd-submit" },
      { icon: ClipboardList, label: "My Submissions", path: "/rd-submissions" },
    ]},
    { section: "Reports", items: [
      { icon: BarChart3, label: "Performance", path: "/performance" },
    ]},
  ],
  faculty: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]},
    { section: "R&D", items: [
      { icon: FlaskConical, label: "My Research", path: "/rd-projects" },
      { icon: FileText, label: "Submit Data", path: "/rd-submit" },
      { icon: BookOpen, label: "Publications", path: "/publications" },
      { icon: Award, label: "Patents & Awards", path: "/patents" },
    ]},
    { section: "Reports", items: [
      { icon: BarChart3, label: "Analytics", path: "/performance" },
      { icon: Download, label: "Export Data", path: "/export" },
    ]},
  ],
  branch_coordinator: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]},
    { section: "R&D Management", items: [
      { icon: FlaskConical, label: "All R&D Data", path: "/rd-projects", badge: 3 },
      { icon: CheckSquare, label: "Verify Submissions", path: "/verify", badge: 5 },
      { icon: Users, label: "Team Members", path: "/team" },
      { icon: ClipboardList, label: "Pending Review", path: "/pending" },
    ]},
    { section: "Reports", items: [
      { icon: BarChart3, label: "Branch Report", path: "/performance" },
      { icon: Download, label: "Export", path: "/export" },
    ]},
  ],
  branch_hod: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]},
    { section: "R&D", items: [
      { icon: FlaskConical, label: "R&D Overview", path: "/rd-projects" },
      { icon: CheckSquare, label: "Approve Data", path: "/verify", badge: 4 },
      { icon: Users, label: "Faculty", path: "/team" },
    ]},
    { section: "Branch Admin", items: [
      { icon: Calendar, label: "Deadlines", path: "/deadlines" },
      { icon: BarChart3, label: "Analytics", path: "/performance" },
      { icon: Download, label: "Reports", path: "/export" },
    ]},
  ],
  rd_incharge: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]},
    { section: "R&D Central", items: [
      { icon: Layers, label: "All Branches R&D", path: "/rd-projects" },
      { icon: CheckSquare, label: "Final Approval", path: "/verify", badge: 7 },
      { icon: TrendingUp, label: "Trends", path: "/trends" },
    ]},
    { section: "Reports", items: [
      { icon: BarChart3, label: "Analytics", path: "/performance" },
      { icon: FileText, label: "Generate Report", path: "/reports" },
      { icon: Download, label: "Export", path: "/export" },
    ]},
  ],
  dean_pd: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]},
    { section: "Planning", items: [
      { icon: TrendingUp, label: "College Overview", path: "/overview" },
      { icon: BarChart3, label: "Analytics", path: "/performance" },
      { icon: Calendar, label: "Planning", path: "/planning" },
    ]},
    { section: "Reports", items: [
      { icon: FileText, label: "Reports", path: "/reports" },
      { icon: Download, label: "Export", path: "/export" },
    ]},
  ],
  iqac_incharge: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]},
    { section: "Quality", items: [
      { icon: Shield, label: "Quality Metrics", path: "/quality" },
      { icon: Award, label: "Accreditation", path: "/accreditation" },
      { icon: ClipboardList, label: "NAAC / NBA", path: "/naac" },
    ]},
    { section: "Reports", items: [
      { icon: BarChart3, label: "Analytics", path: "/performance" },
      { icon: FileText, label: "Audit Reports", path: "/reports" },
      { icon: Download, label: "Export", path: "/export" },
    ]},
  ],
  principal: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]},
    { section: "College", items: [
      { icon: Building2, label: "All Departments", path: "/departments" },
      { icon: Users, label: "Faculty & Staff", path: "/team" },
      { icon: TrendingUp, label: "Insights", path: "/trends" },
    ]},
    { section: "Reports", items: [
      { icon: Award, label: "Accreditation", path: "/accreditation" },
      { icon: FileText, label: "Reports", path: "/reports" },
      { icon: Download, label: "Export", path: "/export" },
    ]},
  ],
  college_management: [
    { section: "Overview", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]},
    { section: "Institution", items: [
      { icon: TrendingUp, label: "Performance", path: "/performance" },
      { icon: BarChart3, label: "Analytics", path: "/trends" },
      { icon: Building2, label: "Departments", path: "/departments" },
    ]},
    { section: "Compliance", items: [
      { icon: Shield, label: "Compliance", path: "/accreditation" },
      { icon: FileText, label: "Reports", path: "/reports" },
    ]},
  ],
  super_admin: [
    { section: "System", items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Database, label: "Database", path: "/database" },
      { icon: Shield, label: "Permissions", path: "/permissions" },
    ]},
    { section: "Management", items: [
      { icon: Users, label: "All Users", path: "/users" },
      { icon: Building2, label: "Departments", path: "/departments" },
      { icon: Settings, label: "System Config", path: "/config" },
    ]},
    { section: "Analytics", items: [
      { icon: BarChart3, label: "System Analytics", path: "/performance" },
      { icon: FileText, label: "Audit Logs", path: "/reports" },
      { icon: Download, label: "Export", path: "/export" },
    ]},
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!user) return null;

  const navSections = NAV_CONFIG[user.role] || [];
  const initials = user.name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "?";

  const handleNav = (path) => navigate(path);
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">IQ</div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">CAMPUS-IQ</div>
          <div className="sidebar-logo-sub">Smart College System</div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="sidebar-role-badge">
        <div className="sidebar-role-avatar">{initials}</div>
        <div className="sidebar-role-info">
          <div className="sidebar-role-name">{user.name}</div>
          <div className="sidebar-role-label">{user.label}</div>
        </div>
        <ChevronRight size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.path}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => handleNav(item.path)}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Icon size={16} className="nav-item-icon" />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && <span className="nav-item-badge">{item.badge}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
