import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Award, BarChart3, Building2, FileText, Download } from "lucide-react";

const yearlyData = [
  { year: "2022", rd: 80, quality: 75 },
  { year: "2023", rd: 88, quality: 80 },
  { year: "2024", rd: 92, quality: 85 },
  { year: "2025", rd: 95, quality: 88 },
  { year: "2026", rd: 97, quality: 91 },
];

const compliance = [
  { item: "NAAC Accreditation", status: "Valid till 2028", score: "A+ (3.24)", risk: "Low" },
  { item: "University Affiliation", status: "Valid till 2027", score: "Full Affiliate", risk: "Low" },
  { item: "NBA — CE Branch", status: "Under Process", score: "Pending", risk: "Medium" },
  { item: "NBA — IT Branch", status: "Accredited", score: "2022–2025", risk: "Renewal Due" },
  { item: "AICTE Compliance", status: "Compliant", score: "100%", risk: "Low" },
];

const highlights = [
  { label: "Total Enrollment", value: "1,340", change: "+2.4%" },
  { label: "Faculty Positions", value: "58", change: "+5.4%" },
  { label: "Research Output", value: "146", change: "+8.3%" },
  { label: "Funded Projects", value: "12", change: "+3" },
];

export default function ManagementDashboard() {
  return (
    <Layout title="College Management" subtitle="CAMPUS-IQ · Institutional Governance & Strategic Overview">
      <StatCardGrid>
        <StatCard label="Total Enrollment" value="1,340" icon={TrendingUp} color="blue" trend={2.4} />
        <StatCard label="Annual R&D Output" value="146" icon={BarChart3} color="cyan" trend={8.3} />
        <StatCard label="NAAC Grade" value="A+" icon={Award} color="green" />
        <StatCard label="Funded Projects" value="₹1.2 Cr" icon={Building2} color="orange" trend={15} />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">5-Year Institutional Growth</div>
              <div className="card-subtitle">R&D output and quality score trajectory</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={yearlyData}>
              <XAxis dataKey="year" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
              <Line type="monotone" dataKey="rd" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: "var(--primary)", r: 5 }} name="R&D Score" />
              <Line type="monotone" dataKey="quality" stroke="var(--warning)" strokeWidth={2.5} dot={{ fill: "var(--warning)", r: 5 }} name="Quality Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Key Metrics</div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{h.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{h.value}</span>
                  <span style={{ fontSize: 11, color: "var(--success)", background: "rgba(16,185,129,0.12)", padding: "2px 8px", borderRadius: 99 }}>{h.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Regulatory Compliance Status</div>
            <div className="card-subtitle">Accreditation and affiliation compliance overview</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm"><FileText size={13} /> Board Report</button>
            <button className="btn btn-primary btn-sm"><Download size={13} /> Export</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Item</th><th>Status</th><th>Score / Grade</th><th>Risk Level</th></tr>
          </thead>
          <tbody>
            {compliance.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{c.item}</td>
                <td className="td-muted">{c.status}</td>
                <td style={{ fontWeight: 600 }}>{c.score}</td>
                <td><span className={`badge ${c.risk === "Low" ? "success" : c.risk === "Medium" || c.risk === "Renewal Due" ? "warning" : "danger"}`}>{c.risk}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
