import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { FlaskConical, Award, Upload, Clock, BookOpen, TrendingUp } from "lucide-react";

const monthlyData = [
  { month: "Oct", projects: 1 },
  { month: "Nov", projects: 2 },
  { month: "Dec", projects: 1 },
  { month: "Jan", projects: 3 },
  { month: "Feb", projects: 2 },
  { month: "Mar", projects: 4 },
];

const myProjects = [
  { title: "AI-Based Traffic Control System", type: "Project", status: "Submitted", date: "Mar 15, 2026" },
  { title: "Smart Irrigation using IoT", type: "Paper", status: "Pending Review", date: "Mar 10, 2026" },
  { title: "Blockchain in Healthcare", type: "Paper", status: "Approved", date: "Feb 28, 2026" },
  { title: "ML-based Disease Prediction", type: "Project", status: "Draft", date: "Mar 20, 2026" },
];

export default function StudentDashboard() {
  return (
    <Layout title="Student Dashboard" subtitle="CAMPUS-IQ · R&D Module · AY 2025–26">
      {/* Stat Cards */}
      <StatCardGrid>
        <StatCard label="My Projects" value="4" icon={FlaskConical} color="blue" trend={2} />
        <StatCard label="Submissions" value="3" icon={Upload} color="green" trend={1} />
        <StatCard label="Pending Review" value="1" icon={Clock} color="orange" />
        <StatCard label="Approved" value="2" icon={Award} color="cyan" trend={1} />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Monthly Activity Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">My R&D Activity</div>
              <div className="card-subtitle">Projects submitted per month</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Bar dataKey="projects" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profile & Info */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">My Profile</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Branch", value: "Computer Engineering" },
              { label: "Year", value: "Third Year (2024–25)" },
              { label: "Roll No", value: "CE-21045" },
              { label: "Guide", value: "Dr. Priya Patil" },
              { label: "SGPA", value: "8.7 / 10" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">My Submissions</div>
            <div className="card-subtitle">All R&D work submitted this academic year</div>
          </div>
          <button className="btn btn-primary btn-sm"><Upload size={13} /> New Submission</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myProjects.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{p.title}</td>
                <td><span className="badge info">{p.type}</span></td>
                <td>
                  <span className={`badge ${p.status === "Approved" ? "success" : p.status === "Submitted" ? "primary" : p.status === "Pending Review" ? "warning" : "muted"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="td-muted">{p.date}</td>
                <td><button className="btn btn-secondary btn-sm"><BookOpen size={12} /> View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
