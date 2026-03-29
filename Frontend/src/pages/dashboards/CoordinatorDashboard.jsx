import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckSquare, Clock, Users, AlertTriangle, FileText, Eye } from "lucide-react";

const verifyData = [
  { week: "W1", submitted: 4, verified: 3 },
  { week: "W2", submitted: 6, verified: 5 },
  { week: "W3", submitted: 3, verified: 3 },
  { week: "W4", submitted: 8, verified: 6 },
];

const pendingItems = [
  { faculty: "Dr. Priya Patil", title: "ML for Disease Detection", type: "Paper", submitted: "Mar 20", priority: "High" },
  { faculty: "Prof. Ravi Kumar", title: "IoT Smart Home Automation", type: "Project", submitted: "Mar 19", priority: "Medium" },
  { faculty: "Ms. Anjali Singh", title: "5G Network Slicing Techniques", type: "Paper", submitted: "Mar 18", priority: "High" },
  { faculty: "Dr. Anil Joshi", title: "Edge Computing Framework", type: "Project", submitted: "Mar 17", priority: "Low" },
  { faculty: "Rahul Sharma (Stu)", title: "AI Traffic Control System", type: "Project", submitted: "Mar 15", priority: "Medium" },
];

export default function CoordinatorDashboard() {
  return (
    <Layout title="Branch Coordinator" subtitle="CAMPUS-IQ · Computer Engineering · R&D Verification">
      <div className="alert-banner info" style={{ marginBottom: 20 }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong>5 submissions</strong> are awaiting your verification. Deadline for monthly report: <strong>March 31, 2026</strong>.
        </div>
      </div>

      <StatCardGrid>
        <StatCard label="Pending Verification" value="5" icon={Clock} color="orange" />
        <StatCard label="Verified This Month" value="17" icon={CheckSquare} color="green" trend={4.2} />
        <StatCard label="Team Members" value="8" icon={Users} color="blue" />
        <StatCard label="Overdue Items" value="2" icon={AlertTriangle} color="red" />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Verification Progress</div>
              <div className="card-subtitle">Submitted vs Verified per week</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={verifyData} barCategoryGap="35%">
              <XAxis dataKey="week" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Bar dataKey="submitted" fill="rgba(79,70,229,0.3)" radius={[4,4,0,0]} name="Submitted" />
              <Bar dataKey="verified" fill="var(--success)" radius={[4,4,0,0]} name="Verified" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Quick Actions</div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Bulk Verify Pending", icon: CheckSquare, color: "success" },
              { label: "Add Cross-Branch Member", icon: Users, color: "primary" },
              { label: "Generate Branch Report", icon: FileText, color: "secondary" },
              { label: "Set Verification Deadline", icon: Clock, color: "secondary" },
            ].map(a => (
              <button key={a.label} className={`btn btn-${a.color}`} style={{ justifyContent: "flex-start" }}>
                <a.icon size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Verification Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Pending Verification Queue</div>
            <div className="card-subtitle">Items awaiting your review and verification</div>
          </div>
          <button className="btn btn-primary btn-sm"><CheckSquare size={13} /> Verify All</button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Faculty / Student</th><th>Title</th><th>Type</th><th>Submitted</th><th>Priority</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {pendingItems.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{item.faculty}</td>
                <td className="td-muted">{item.title}</td>
                <td><span className="badge info">{item.type}</span></td>
                <td className="td-muted">{item.submitted}</td>
                <td>
                  <span className={`badge ${item.priority === "High" ? "danger" : item.priority === "Medium" ? "warning" : "muted"}`}>
                    {item.priority}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-success btn-sm"><CheckSquare size={11} /> Verify</button>
                  <button className="btn btn-secondary btn-sm"><Eye size={11} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
