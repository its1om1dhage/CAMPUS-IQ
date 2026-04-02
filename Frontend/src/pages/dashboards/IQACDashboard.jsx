import { useState } from "react";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Shield, Award, CheckSquare, Target, FileText, TrendingUp } from "lucide-react";
import { MOCK_DEPT_STATS } from "../../services/supabase";

const naacCriteria = [
  { criterion: "Curricular Aspects", score: 3.4, max: 4.0, weight: 150 },
  { criterion: "Teaching-Learning", score: 3.6, max: 4.0, weight: 300 },
  { criterion: "Research & Innovation", score: 3.2, max: 4.0, weight: 250 },
  { criterion: "Infrastructure", score: 3.8, max: 4.0, weight: 100 },
  { criterion: "Student Support", score: 3.5, max: 4.0, weight: 100 },
  { criterion: "Governance", score: 3.7, max: 4.0, weight: 100 },
];

const radarData = naacCriteria.map(c => ({ subject: c.criterion.split(" ")[0], score: c.score, fullMark: 4 }));

export default function IQACDashboard() {
  const [activeTab, setActiveTab] = useState("metrics");

  const totalSubmissions = MOCK_DEPT_STATS.reduce((a, d) => a + d.total, 0);
  const totalApproved = MOCK_DEPT_STATS.reduce((a, d) => a + d.approved, 0);
  const researchScore = naacCriteria.find(c => c.criterion.includes("Research"))?.score || 0;
  const overallNAAC = (naacCriteria.reduce((a, c) => a + (c.score / c.max) * c.weight, 0) / naacCriteria.reduce((a, c) => a + c.weight, 0) * 4).toFixed(2);

  return (
    <Layout title="IQAC Dashboard" subtitle="CAMPUS-IQ · Internal Quality Assurance Cell · Accreditation View">
      <StatCardGrid>
        <StatCard label="NAAC Score (Projected)" value={overallNAAC} icon={Award} color="cyan" trend={0.15} />
        <StatCard label="R&D Score" value={`${researchScore}/4.0`} icon={TrendingUp} color="green" />
        <StatCard label="Total R&D Entries" value={totalSubmissions} icon={FileText} color="blue" />
        <StatCard label="Approval Rate" value={`${Math.round((totalApproved / totalSubmissions) * 100)}%`} icon={CheckSquare} color="purple" />
      </StatCardGrid>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Quality & Accreditation Center</div>
          <ExportButton data={MOCK_DEPT_STATS} filename="iqac_audit_report" label="Export Audit Report" />
        </div>

        <div className="tabs">
          {[
            { key: "metrics", label: "📊 Quality Metrics" },
            { key: "naac", label: "🏆 NAAC/NBA" },
            { key: "audit", label: "📋 Audit-Ready Data" },
          ].map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "metrics" && (
          <div className="grid-2" style={{ marginTop: 8 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Department Approval Rates</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MOCK_DEPT_STATS}>
                  <XAxis dataKey="short" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10 }} />
                  <Bar dataKey="approved" name="Approval %" fill="var(--success)" radius={[4, 4, 0, 0]}
                    // Show as percentage
                    label={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>NAAC Radar Analysis</div>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                  <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "naac" && (
          <div style={{ marginTop: 8 }}>
            <div className="alert-banner success" style={{ marginBottom: 20 }}>
              <Award size={15} />
              <div>Projected NAAC score: <strong>{overallNAAC}/4.0</strong> · Category: <strong>A+</strong> (projected)</div>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>Criterion</th><th>Score</th><th>Max</th><th>Weight</th><th>Performance</th></tr>
              </thead>
              <tbody>
                {naacCriteria.map(c => (
                  <tr key={c.criterion}>
                    <td style={{ fontWeight: 600 }}>{c.criterion}</td>
                    <td style={{ fontWeight: 700, color: "var(--primary-light)" }}>{c.score}</td>
                    <td style={{ color: "var(--text-muted)" }}>{c.max}</td>
                    <td><span className="badge muted">{c.weight}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
                        <div className="progress-track" style={{ flex: 1 }}>
                          <div className="progress-fill green" style={{ width: `${(c.score / c.max) * 100}%` }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, minWidth: 36 }}>{Math.round((c.score / c.max) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "audit" && (
          <div style={{ marginTop: 8 }}>
            <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
              <ExportButton data={MOCK_DEPT_STATS} filename="audit_data_export" label="Export for Audit" />
              <button className="btn btn-secondary btn-sm"><FileText size={13} /> Generate NAAC Report</button>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>Department</th><th>Total Entries</th><th>Approved</th><th>Pending</th><th>Approval Rate</th><th>Papers</th><th>Projects</th><th>Patents</th></tr>
              </thead>
              <tbody>
                {MOCK_DEPT_STATS.map(d => (
                  <tr key={d.dept}>
                    <td style={{ fontWeight: 600 }}>{d.dept}</td>
                    <td>{d.total}</td>
                    <td style={{ color: "var(--success)", fontWeight: 600 }}>{d.approved}</td>
                    <td style={{ color: "var(--warning)", fontWeight: 600 }}>{d.pending}</td>
                    <td><span className={`badge ${Math.round((d.approved / d.total) * 100) > 80 ? "success" : "warning"}`}>{Math.round((d.approved / d.total) * 100)}%</span></td>
                    <td>{d.papers}</td>
                    <td>{d.projects}</td>
                    <td>{d.patents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
