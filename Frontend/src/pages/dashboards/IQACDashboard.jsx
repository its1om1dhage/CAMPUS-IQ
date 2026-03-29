import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Shield, Award, CheckSquare, AlertTriangle, FileText, Download } from "lucide-react";

const naacCriteria = [
  { criterion: "Curricular", value: 88 },
  { criterion: "Teaching", value: 92 },
  { criterion: "Research", value: 85 },
  { criterion: "Infrastructure", value: 78 },
  { criterion: "Student Support", value: 90 },
  { criterion: "Governance", value: 82 },
  { criterion: "Best Practices", value: 75 },
];

const qualityData = [
  { month: "Oct", naac: 82, nba: 78 },
  { month: "Nov", naac: 84, nba: 80 },
  { month: "Dec", naac: 83, nba: 82 },
  { month: "Jan", naac: 86, nba: 84 },
  { month: "Feb", naac: 88, nba: 85 },
  { month: "Mar", naac: 90, nba: 87 },
];

const auditItems = [
  { item: "Faculty R&D Data Completeness", coverage: "94%", status: "Compliant", risk: "Low" },
  { item: "Student Project Documentation", coverage: "87%", status: "Compliant", risk: "Low" },
  { item: "Patent & IP Records", coverage: "72%", status: "Needs Attention", risk: "Medium" },
  { item: "Funding & Grant Records", coverage: "65%", status: "Non-Compliant", risk: "High" },
  { item: "Conference Publications", coverage: "89%", status: "Compliant", risk: "Low" },
];

export default function IQACDashboard() {
  return (
    <Layout title="IQAC Incharge Dashboard" subtitle="CAMPUS-IQ · Internal Quality Assurance Cell">
      <StatCardGrid>
        <StatCard label="NAAC Score" value="3.24 / 4" icon={Award} color="green" trend={0.12} trendLabel="from last cycle" />
        <StatCard label="NBA Compliant Branches" value="3/5" icon={Shield} color="blue" />
        <StatCard label="Audit Items" value="5" icon={CheckSquare} color="orange" />
        <StatCard label="Critical Issues" value="1" icon={AlertTriangle} color="red" />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Quality Score Trends</div>
              <div className="card-subtitle">NAAC vs NBA scores over 6 months</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={qualityData} barCategoryGap="30%">
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
              <Bar dataKey="naac" fill="var(--success)" radius={[4,4,0,0]} name="NAAC Score" />
              <Bar dataKey="nba" fill="var(--accent)" radius={[4,4,0,0]} name="NBA Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">NAAC Criteria Scores</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={naacCriteria}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="criterion" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
              <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audit Compliance Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Audit Compliance Status</div>
            <div className="card-subtitle">Data completeness and compliance tracking for accreditation</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm"><Download size={13} /> Export NAAC</button>
            <button className="btn btn-primary btn-sm"><FileText size={13} /> Generate Audit Report</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Audit Item</th><th>Data Coverage</th><th>Compliance</th><th>Risk</th></tr>
          </thead>
          <tbody>
            {auditItems.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{a.item}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="progress-track" style={{ flex: 1, height: 6, minWidth: 80 }}>
                      <div className={`progress-fill ${parseInt(a.coverage) > 85 ? "green" : parseInt(a.coverage) > 70 ? "orange" : "red"}`} style={{ width: a.coverage }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", minWidth: 36 }}>{a.coverage}</span>
                  </div>
                </td>
                <td><span className={`badge ${a.status === "Compliant" ? "success" : a.status === "Needs Attention" ? "warning" : "danger"}`}>{a.status}</span></td>
                <td><span className={`badge ${a.risk === "Low" ? "success" : a.risk === "Medium" ? "warning" : "danger"}`}>{a.risk}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
