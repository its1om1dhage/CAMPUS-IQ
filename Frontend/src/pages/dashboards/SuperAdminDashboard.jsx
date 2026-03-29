import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Database, Users, Shield, Settings, AlertTriangle, Activity, Download, Eye, Trash2, RefreshCw } from "lucide-react";

const systemMetrics = [
  { hour: "06", load: 15 }, { hour: "08", load: 45 }, { hour: "10", load: 72 },
  { hour: "12", load: 85 }, { hour: "14", load: 90 }, { hour: "16", load: 78 },
  { hour: "18", load: 55 }, { hour: "20", load: 38 }, { hour: "22", load: 20 },
];

const allUsers = [
  { name: "Dr. Ashok Nair", role: "Principal", id: "PRIN2024001", lastLogin: "Today 9:20 AM", status: "Active" },
  { name: "Dr. Meera Tiwari", role: "IQAC Incharge", id: "IQAC2024001", lastLogin: "Today 8:45 AM", status: "Active" },
  { name: "Dr. Rajesh Deshmukh", role: "R&D Incharge", id: "RD2024001", lastLogin: "Today 10:00 AM", status: "Active" },
  { name: "Dr. Sunita More", role: "Branch HOD", id: "HOD2024001", lastLogin: "Yesterday", status: "Active" },
  { name: "Prof. Amit Kulkarni", role: "Coordinator", id: "FAC2024015", lastLogin: "Today", status: "Active" },
  { name: "Mr. Guest User", role: "Faculty", id: "FAC2024099", lastLogin: "3 days ago", status: "Inactive" },
];

const systemAlerts = [
  { type: "warning", msg: "Database storage at 72% capacity" },
  { type: "info", msg: "Scheduled backup completed successfully at 02:00 AM" },
  { type: "danger", msg: "1 failed login attempt detected for account FAC2024099" },
];

export default function SuperAdminDashboard() {
  return (
    <Layout title="Super Admin" subtitle="CAMPUS-IQ · System Control · Full Access">
      {/* System Alerts */}
      {systemAlerts.map((a, i) => (
        <div key={i} className={`alert-banner ${a.type}`} style={{ marginBottom: i === systemAlerts.length - 1 ? 20 : 8 }}>
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13 }}>{a.msg}</span>
        </div>
      ))}

      <StatCardGrid>
        <StatCard label="Total Users" value="76" icon={Users} color="blue" trend={3.2} />
        <StatCard label="System Uptime" value="99.8%" icon={Activity} color="green" />
        <StatCard label="DB Storage Used" value="72%" icon={Database} color="orange" />
        <StatCard label="Open Alerts" value="3" icon={Shield} color="red" />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">System Load Today</div>
              <div className="card-subtitle">CPU / memory load by hour</div>
            </div>
            <button className="btn btn-secondary btn-sm"><RefreshCw size={12} /> Refresh</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={systemMetrics}>
              <XAxis dataKey="hour" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }}
                formatter={(v) => [`${v}%`, "Load"]}
              />
              <Bar dataKey="load" fill="var(--danger)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Quick Admin Actions</div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Manage Roles & Permissions", icon: Shield, color: "primary" },
              { label: "Add / Remove User", icon: Users, color: "secondary" },
              { label: "System Configuration", icon: Settings, color: "secondary" },
              { label: "Database Backup", icon: Database, color: "success" },
              { label: "Export All Data", icon: Download, color: "secondary" },
            ].map(a => (
              <button key={a.label} className={`btn btn-${a.color}`} style={{ justifyContent: "flex-start" }}>
                <a.icon size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All Users Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">All System Users</div>
            <div className="card-subtitle">Manage roles, access, and accounts system-wide</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm"><Download size={13} /> Export</button>
            <button className="btn btn-primary btn-sm"><Users size={13} /> Add User</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Role</th><th>ID</th><th>Last Login</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {allUsers.map((u, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td><span className="badge primary">{u.role}</span></td>
                <td className="td-muted">{u.id}</td>
                <td className="td-muted">{u.lastLogin}</td>
                <td><span className={`badge ${u.status === "Active" ? "success" : "muted"}`}>{u.status}</span></td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-secondary btn-sm"><Eye size={11} /></button>
                  <button className="btn btn-secondary btn-sm"><Settings size={11} /></button>
                  <button className="btn btn-danger btn-sm"><Trash2 size={11} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
