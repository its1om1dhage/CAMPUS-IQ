import { useState } from "react";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { GraduationCap, Building2, Users, Award, TrendingUp, FileText } from "lucide-react";
import { MOCK_DEPT_STATS, MOCK_TRENDS } from "../../services/supabase";

const announcements = [
  { text: "NAAC peer team visit scheduled for April 15, 2026", time: "2h ago", type: "info" },
  { text: "R&D data submission deadline extended to March 31", time: "1d ago", type: "warning" },
  { text: "CSE department achieved 85% approval rate — highest this year", time: "2d ago", type: "success" },
  { text: "New patent filed by EE department faculty", time: "3d ago", type: "success" },
];

export default function PrincipalDashboard() {
  const totalSubmissions = MOCK_DEPT_STATS.reduce((a, d) => a + d.total, 0);
  const totalApproved = MOCK_DEPT_STATS.reduce((a, d) => a + d.approved, 0);
  const totalPatents = MOCK_DEPT_STATS.reduce((a, d) => a + d.patents, 0);
  const approvalRate = Math.round((totalApproved / totalSubmissions) * 100);
  const [activeTab, setActiveTab] = useState("executive");

  return (
    <Layout title="Principal Dashboard" subtitle="CAMPUS-IQ · Entire College · Executive Summary">
      <StatCardGrid>
        <StatCard label="Total College R&D" value={totalSubmissions} icon={TrendingUp} color="blue" trend={15.2} />
        <StatCard label="Overall Approval Rate" value={`${approvalRate}%`} icon={Award} color="green" trend={3.1} />
        <StatCard label="Total Patents" value={totalPatents} icon={GraduationCap} color="cyan" trend={8.0} />
        <StatCard label="Active Departments" value={MOCK_DEPT_STATS.length} icon={Building2} color="purple" />
      </StatCardGrid>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Executive Dashboard</div>
          <ExportButton data={MOCK_DEPT_STATS} filename="principal_executive_report" label="Export Report" />
        </div>

        <div className="tabs">
          {[
            { key: "executive", label: "📊 Executive Summary" },
            { key: "accreditation", label: "🏆 Accreditation" },
          ].map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "executive" && (
          <div>
            <div className="grid-2" style={{ marginTop: 8 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 14 }}>College-wide R&D Growth</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MOCK_TRENDS}>
                    <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
                    <Line type="monotone" dataKey="submissions" stroke="var(--primary-light)" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 14 }}>Latest Updates</div>
                <div className="activity-list">
                  {announcements.map((a, i) => (
                    <div key={i} className="activity-item">
                      <div className={`activity-dot ${a.type}`}>
                        {a.type === "info" ? "ℹ" : a.type === "warning" ? "⚠" : "✓"}
                      </div>
                      <div className="activity-body">
                        <div className="activity-title">{a.text}</div>
                        <div className="activity-meta">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 14 }}>Department Performance Overview</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MOCK_DEPT_STATS} barCategoryGap="30%">
                  <XAxis dataKey="short" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="papers" fill="var(--primary)" radius={[3, 3, 0, 0]} name="Papers" stackId="a" />
                  <Bar dataKey="projects" fill="var(--accent)" radius={[0, 0, 0, 0]} name="Projects" stackId="a" />
                  <Bar dataKey="patents" fill="var(--success)" radius={[3, 3, 0, 0]} name="Patents" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "accreditation" && (
          <div style={{ marginTop: 8 }}>
            <div className="grid-3">
              {[
                { label: "NAAC Score", value: "3.51", subtext: "Grade A+", color: "green", icon: Award },
                { label: "NBA Programs", value: "3/5", subtext: "Accredited", color: "blue", icon: GraduationCap },
                { label: "R&D Criterion Score", value: "3.2/4.0", subtext: "Criterion III", color: "cyan", icon: TrendingUp },
              ].map(item => (
                <div key={item.label} style={{ padding: "20px", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", textAlign: "center" }}>
                  <item.icon size={28} style={{ color: item.color === "green" ? "var(--success)" : item.color === "blue" ? "var(--primary-light)" : "var(--accent)", margin: "0 auto 10px" }} />
                  <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Outfit", color: "var(--text-primary)" }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 4 }}>{item.label}</div>
                  <span className="badge muted" style={{ marginTop: 8 }}>{item.subtext}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
