import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, BarChart3, Award, Calendar, FileText, Download } from "lucide-react";

const trendData = [
  { month: "Jun", score: 78 }, { month: "Jul", score: 80 },
  { month: "Aug", score: 83 }, { month: "Sep", score: 82 },
  { month: "Oct", score: 85 }, { month: "Nov", score: 87 },
  { month: "Dec", score: 88 }, { month: "Jan", score: 86 },
  { month: "Feb", score: 90 }, { month: "Mar", score: 91 },
];

const deptData = [
  { name: "CE", value: 30, color: "#4f46e5" },
  { name: "IT", value: 25, color: "#06b6d4" },
  { name: "EE", value: 20, color: "#10b981" },
  { name: "MECH", value: 15, color: "#f59e0b" },
  { name: "CIVIL", value: 10, color: "#8b5cf6" },
];

const upcomingPlans = [
  { item: "Annual NAAC Self-Study Report", deadline: "April 30, 2026", status: "In Progress" },
  { item: "NBA Accreditation — CE Branch", deadline: "June 15, 2026", status: "Planned" },
  { item: "University Affiliation Renewal", deadline: "May 1, 2026", status: "Pending Data" },
  { item: "Infrastructure Development Report", deadline: "April 10, 2026", status: "In Progress" },
];

export default function DeanDashboard() {
  return (
    <Layout title="Dean P&D Dashboard" subtitle="CAMPUS-IQ · Planning & Development · College Overview">
      <StatCardGrid>
        <StatCard label="College R&D Score" value="91%" icon={TrendingUp} color="blue" trend={3} />
        <StatCard label="Active Departments" value="5" icon={BarChart3} color="green" />
        <StatCard label="Accreditation Items" value="4" icon={Award} color="orange" />
        <StatCard label="Pending Plans" value="2" icon={Calendar} color="purple" />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">College R&D Performance Trend</div>
              <div className="card-subtitle">Overall monthly quality score</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: "var(--primary)", r: 4 }} name="Score %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">R&D by Department</div></div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                {deptData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Planning Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Strategic Planning Items</div>
            <div className="card-subtitle">Accreditation, audits, and institutional planning</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm"><Download size={13} /> Export</button>
            <button className="btn btn-primary btn-sm"><FileText size={13} /> New Plan</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Planning Item</th><th>Deadline</th><th>Status</th></tr>
          </thead>
          <tbody>
            {upcomingPlans.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{p.item}</td>
                <td className="td-muted">{p.deadline}</td>
                <td><span className={`badge ${p.status === "In Progress" ? "info" : p.status === "Planned" ? "primary" : "warning"}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
