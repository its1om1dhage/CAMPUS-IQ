import { useState } from "react";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import DataTable from "../../Components/DataTable";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Database, Shield, Users, Settings, Activity, AlertTriangle, CheckSquare, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { MOCK_USERS, MOCK_DEPT_STATS } from "../../services/supabase";

const systemLogs = [
  { id: 1, action: "Submission approved", user: "Dr. Rajesh Deshmukh", role: "rd_incharge", time: "10 min ago", type: "success" },
  { id: 2, action: "New user registered", user: "System", role: "system", time: "25 min ago", type: "info" },
  { id: 3, action: "Submission rejected", user: "Prof. Amit Kulkarni", role: "branch_coordinator", time: "1h ago", type: "danger" },
  { id: 4, action: "Portal deadline updated", user: "Dr. Rajesh Deshmukh", role: "rd_incharge", time: "2h ago", type: "warning" },
  { id: 5, action: "Bulk export triggered", user: "Dr. Sunita More", role: "branch_hod", time: "3h ago", type: "info" },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [portalOpen, setPortalOpen] = useState(true);
  const [search, setSearch] = useState("");

  const totalSubmissions = MOCK_DEPT_STATS.reduce((a, d) => a + d.total, 0);
  const filteredUsers = MOCK_USERS.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())
  );

  const userColumns = [
    { key: "id", label: "ID", render: v => <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>{v}</span> },
    { key: "name", label: "Name", sortable: true, render: v => <div style={{ fontWeight: 600 }}>{v}</div> },
    { key: "role", label: "Role", render: v => <span className="badge primary">{v.replace(/_/g, " ")}</span> },
    { key: "department", label: "Dept", render: v => <span className="badge muted">{v}</span> },
    { key: "email", label: "Email", render: v => <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{v}</span> },
    { key: "status", label: "Status", render: v => <span className={`badge ${v === "active" ? "success" : "danger"}`}>{v}</span> },
    {
      key: "id", label: "Actions",
      render: () => (
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-secondary btn-sm"><Eye size={11} /></button>
          <button className="btn btn-danger btn-sm">Disable</button>
        </div>
      )
    },
  ];

  const logColumns = [
    { key: "action", label: "Action", render: (v, row) => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: row.type === "success" ? "var(--success)" : row.type === "danger" ? "var(--danger)" : row.type === "warning" ? "var(--warning)" : "var(--info)", flexShrink: 0 }} />{v}</div> },
    { key: "user", label: "By", render: v => <div style={{ fontWeight: 500 }}>{v}</div> },
    { key: "role", label: "Role", render: v => <span className="badge muted" style={{ fontSize: 10 }}>{v}</span> },
    { key: "time", label: "Time", render: v => <span className="td-muted">{v}</span> },
  ];

  return (
    <Layout title="Super Admin Dashboard" subtitle="CAMPUS-IQ · System Administration · Full Access">
      <StatCardGrid>
        <StatCard label="Total Users" value={MOCK_USERS.length + 94} icon={Users} color="blue" subtext="Active accounts" />
        <StatCard label="Total Submissions" value={totalSubmissions} icon={Database} color="purple" />
        <StatCard label="System Health" value="99.8%" icon={Activity} color="green" trend={0.1} />
        <StatCard label="Pending Issues" value="0" icon={AlertTriangle} color="cyan" />
      </StatCardGrid>

      {/* Portal Toggle */}
      <div style={{ marginBottom: 20, padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>Submission Portal Status</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Control whether submissions are open college-wide</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className={`badge ${portalOpen ? "success" : "danger"}`} style={{ fontSize: 13 }}>{portalOpen ? "OPEN" : "CLOSED"}</span>
          <button
            onClick={() => setPortalOpen(!portalOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: portalOpen ? "var(--success)" : "var(--danger)" }}
          >
            {portalOpen ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">System Administration</div>
          <ExportButton data={MOCK_USERS} filename="admin_user_export" label="Export Users" />
        </div>

        <div className="tabs">
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "users", label: `👥 Users (${MOCK_USERS.length + 94})` },
            { key: "logs", label: "📋 Audit Logs" },
            { key: "config", label: "⚙️ Config" },
          ].map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid-2" style={{ marginTop: 12 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 14 }}>Department Submission Overview</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MOCK_DEPT_STATS}>
                  <XAxis dataKey="short" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
                  <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 14 }}>User Distribution by Role</div>
              {[
                { role: "Students", count: 1240, color: "var(--info)" },
                { role: "Faculty", count: 68, color: "var(--success)" },
                { role: "Coordinators", count: 10, color: "var(--primary-light)" },
                { role: "HODs", count: 10, color: "var(--warning)" },
                { role: "Higher Officials", count: 4, color: "var(--accent)" },
              ].map(r => (
                <div key={r.role} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{r.role}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.count}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill blue" style={{ width: `${(r.count / 1340) * 100}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <div className="header-search" style={{ maxWidth: 320 }}>
                <span style={{ fontSize: 14 }}>🔍</span>
                <input placeholder="Search users by name or role..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <DataTable columns={userColumns} data={filteredUsers} loading={false} emptyTitle="No users found" />
          </>
        )}

        {activeTab === "logs" && (
          <DataTable columns={logColumns} data={systemLogs} loading={false} keyField="id" />
        )}

        {activeTab === "config" && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Submission Portal", desc: "Allow new R&D data submissions", active: portalOpen, toggle: () => setPortalOpen(!portalOpen) },
                { label: "Email Notifications", desc: "Send deadline/approval emails", active: true, toggle: () => {} },
                { label: "Auto-Reject Overdue", desc: "Reject items after 30 days pending", active: false, toggle: () => {} },
                { label: "Maintenance Mode", desc: "Restrict all user access", active: false, toggle: () => {} },
              ].map(setting => (
                <div key={setting.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>{setting.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{setting.desc}</div>
                  </div>
                  <button onClick={setting.toggle} style={{ background: "none", border: "none", cursor: "pointer", color: setting.active ? "var(--success)" : "var(--text-muted)" }}>
                    {setting.active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
