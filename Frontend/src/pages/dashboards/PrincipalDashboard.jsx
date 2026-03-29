import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Users, TrendingUp, Award, Building2, FileText, Download, Eye } from "lucide-react";

const collegeOverview = [
  { month: "Oct", rd: 62, quality: 80 },
  { month: "Nov", rd: 70, quality: 82 },
  { month: "Dec", rd: 65, quality: 83 },
  { month: "Jan", rd: 80, quality: 85 },
  { month: "Feb", rd: 90, quality: 87 },
  { month: "Mar", rd: 100, quality: 90 },
];

const deptSummary = [
  { dept: "CE", faculty: 14, students: 320, rdScore: "91%", accred: "NBA Pending" },
  { dept: "IT", faculty: 12, students: 280, rdScore: "89%", accred: "NBA Accredited" },
  { dept: "EE", faculty: 10, students: 240, rdScore: "85%", accred: "NBA Accredited" },
  { dept: "MECH", faculty: 13, students: 300, rdScore: "80%", accred: "NAAC" },
  { dept: "CIVIL", faculty: 9, students: 200, rdScore: "76%", accred: "NAAC" },
];

export default function PrincipalDashboard() {
  return (
    <Layout title="Principal Dashboard" subtitle="CAMPUS-IQ · Entire College Overview & Administration">
      <StatCardGrid>
        <StatCard label="Total Students" value="1,340" icon={Users} color="blue" trend={2.4} />
        <StatCard label="Total Faculty" value="58" icon={Users} color="green" />
        <StatCard label="College R&D Score" value="91%" icon={TrendingUp} color="cyan" trend={5.1} />
        <StatCard label="NAAC Grade" value="A+" icon={Award} color="orange" />
      </StatCardGrid>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">College-Wide Performance</div>
            <div className="card-subtitle">R&D output vs Quality score trend</div>
          </div>
          <button className="btn btn-secondary btn-sm"><Download size={13} /> Annual Report</button>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={collegeOverview}>
            <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
            <Line type="monotone" dataKey="rd" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: "var(--primary)", r: 4 }} name="R&D Output" />
            <Line type="monotone" dataKey="quality" stroke="var(--success)" strokeWidth={2.5} dot={{ fill: "var(--success)", r: 4 }} name="Quality Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department Summary */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Department Overview</div>
            <div className="card-subtitle">All departments at a glance</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm"><FileText size={13} /> IQAC Report</button>
            <button className="btn btn-primary btn-sm"><Download size={13} /> Export All</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Department</th><th>Faculty</th><th>Students</th><th>R&D Score</th><th>Accreditation</th><th>Details</th></tr>
          </thead>
          <tbody>
            {deptSummary.map((d, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, color: "var(--text-accent)" }}>{d.dept}</td>
                <td>{d.faculty}</td>
                <td>{d.students}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="progress-track" style={{ width: 60, height: 5 }}>
                      <div className={`progress-fill ${parseInt(d.rdScore) > 85 ? "green" : parseInt(d.rdScore) > 75 ? "orange" : "red"}`} style={{ width: d.rdScore }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{d.rdScore}</span>
                  </div>
                </td>
                <td><span className="badge info">{d.accred}</span></td>
                <td><button className="btn btn-secondary btn-sm"><Eye size={12} /> View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
