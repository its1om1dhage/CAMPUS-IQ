import { useState } from "react";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Target, Building2, FileText, Calendar, Bell } from "lucide-react";
import { MOCK_DEPT_STATS, MOCK_TRENDS } from "../../services/supabase";

const goals = [
  { dept: "CSE", target: 40, current: 34 },
  { dept: "AIML", target: 30, current: 27 },
  { dept: "EXTC", target: 25, current: 20 },
  { dept: "EE", target: 28, current: 24 },
  { dept: "MECH", target: 20, current: 16 },
];

export default function DeanDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalSubmissions = MOCK_DEPT_STATS.reduce((a, d) => a + d.total, 0);
  const totalApproved = MOCK_DEPT_STATS.reduce((a, d) => a + d.approved, 0);
  const approvalRate = Math.round((totalApproved / totalSubmissions) * 100);

  return (
    <Layout title="Dean P&D Dashboard" subtitle="CAMPUS-IQ · College Planning & Development · Read-Only View">
      <StatCardGrid>
        <StatCard label="College-wide Submissions" value={totalSubmissions} icon={TrendingUp} color="blue" trend={15.2} />
        <StatCard label="Overall Approval Rate" value={`${approvalRate}%`} icon={Target} color="green" trend={3.1} />
        <StatCard label="Active Departments" value={MOCK_DEPT_STATS.length} icon={Building2} color="purple" />
        <StatCard label="This Month" value="35" icon={Calendar} color="cyan" trend={12.5} />
      </StatCardGrid>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div><div className="card-title">Dashboard</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            <ExportButton data={MOCK_DEPT_STATS} filename="dean_college_report" label="Export Full Report" />
          </div>
        </div>

        <div className="tabs">
          {[
            { key: "overview", label: "📊 College Overview" },
            { key: "goals", label: "🎯 Goals & Targets" },
            { key: "trends", label: "📈 Trends" },
          ].map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div>
            <div className="grid-2" style={{ marginTop: 8 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>Department-wise Submissions</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={MOCK_DEPT_STATS} barCategoryGap="35%">
                    <XAxis dataKey="short" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="approved" fill="var(--success)" radius={[3, 3, 0, 0]} name="Approved" stackId="a" />
                    <Bar dataKey="pending" fill="var(--warning)" radius={[3, 3, 0, 0]} name="Pending" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>Department Rankings</div>
                {MOCK_DEPT_STATS.sort((a, b) => b.total - a.total).slice(0, 6).map((d, i) => (
                  <div key={d.dept} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: i < 3 ? "var(--warning)" : "var(--text-muted)", width: 24 }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{d.dept}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-light)" }}>{d.total}</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill blue" style={{ width: `${(d.approved / d.total) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "goals" && (
          <div style={{ marginTop: 8 }}>
            <div className="alert-banner info" style={{ marginBottom: 20 }}>
              <Target size={15} />
              <div>Set annual targets for each department. Progress is tracked in real-time.</div>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>Department</th><th>Target</th><th>Current</th><th>Progress</th><th>Status</th></tr>
              </thead>
              <tbody>
                {goals.map(g => {
                  const pct = Math.round((g.current / g.target) * 100);
                  return (
                    <tr key={g.dept}>
                      <td style={{ fontWeight: 600 }}>{g.dept}</td>
                      <td style={{ color: "var(--text-muted)" }}>{g.target} entries</td>
                      <td style={{ fontWeight: 700, color: "var(--primary-light)" }}>{g.current}</td>
                      <td style={{ minWidth: 180 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div className="progress-fill green" style={{ width: `${pct}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, minWidth: 36 }}>{pct}%</span>
                        </div>
                      </td>
                      <td><span className={`badge ${pct >= 90 ? "success" : pct >= 60 ? "warning" : "danger"}`}>{pct >= 90 ? "On Track" : pct >= 60 ? "In Progress" : "Behind"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "trends" && (
          <div style={{ marginTop: 8 }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={MOCK_TRENDS}>
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="submissions" stroke="var(--primary-light)" strokeWidth={2.5} dot={{ r: 4 }} name="Submissions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Layout>
  );
}
