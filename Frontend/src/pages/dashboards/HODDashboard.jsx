import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FlaskConical, CheckSquare, Users, TrendingUp, Calendar, FileText, Eye, CheckCircle } from "lucide-react";

const branchData = [
  { month: "Sep", total: 5 }, { month: "Oct", total: 8 },
  { month: "Nov", total: 7 }, { month: "Dec", total: 12 },
  { month: "Jan", total: 10 }, { month: "Feb", total: 15 },
  { month: "Mar", total: 18 },
];

const approvalQueue = [
  { coordinator: "Prof. Amit Kulkarni", title: "Batch of 5 R&D Submissions", count: 5, status: "Coordinator Verified" },
  { coordinator: "Prof. Rakesh Deo", title: "Batch of 3 R&D Submissions", count: 3, status: "Coordinator Verified" },
  { coordinator: "Dr. Kavita Naik", title: "Batch of 4 R&D Submissions", count: 4, status: "Pending Coordinator" },
];

const faculty = [
  { name: "Dr. Priya Patil", publications: 8, projects: 5, patents: 1, status: "Active" },
  { name: "Prof. Ravi Kumar", publications: 4, projects: 3, patents: 0, status: "Active" },
  { name: "Ms. Anjali Singh", publications: 6, projects: 2, patents: 1, status: "Active" },
  { name: "Dr. Anil Joshi", publications: 10, projects: 7, patents: 2, status: "Active" },
];

export default function HODDashboard() {
  return (
    <Layout title="Branch HOD Dashboard" subtitle="CAMPUS-IQ · Computer Engineering · Branch Administration">
      <StatCardGrid>
        <StatCard label="Total R&D (Branch)" value="52" icon={FlaskConical} color="blue" trend={6.1} />
        <StatCard label="Awaiting Approval" value="4" icon={CheckSquare} color="orange" />
        <StatCard label="Faculty Count" value="14" icon={Users} color="green" />
        <StatCard label="Branch R&D Score" value="87%" icon={TrendingUp} color="purple" trend={3.4} />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Branch R&D Growth</div>
              <div className="card-subtitle">Monthly R&D submissions in CE branch</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={branchData}>
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Bar dataKey="total" fill="var(--warning)" radius={[4, 4, 0, 0]} name="Submissions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Approval Queue</div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {approvalQueue.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.coordinator}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.count} items · <span className={`badge ${item.status.includes("Verified") ? "success" : "warning"}`} style={{ padding: "1px 7px", fontSize: 10 }}>{item.status}</span></div>
                </div>
                {item.status.includes("Verified") && (
                  <button className="btn btn-primary btn-sm"><CheckCircle size={12} /> Approve</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty R&D Performance */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Faculty R&D Performance</div>
            <div className="card-subtitle">Current AY 2025–26 statistics</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm"><Calendar size={13} /> Set Deadlines</button>
            <button className="btn btn-primary btn-sm"><FileText size={13} /> Branch Report</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Faculty</th><th>Publications</th><th>Projects</th><th>Patents</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {faculty.map((f, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{f.name}</td>
                <td>{f.publications}</td>
                <td>{f.projects}</td>
                <td>{f.patents}</td>
                <td><span className="badge success">{f.status}</span></td>
                <td><button className="btn btn-secondary btn-sm"><Eye size={12} /> View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
