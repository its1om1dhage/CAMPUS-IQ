import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FlaskConical, CheckSquare, Building2, TrendingUp, FileText, Download, Award } from "lucide-react";

const branchComparison = [
  { branch: "CE", papers: 18, projects: 12, patents: 4 },
  { branch: "MECH", papers: 10, projects: 8, patents: 2 },
  { branch: "CIVIL", papers: 6, projects: 5, patents: 1 },
  { branch: "EE", papers: 14, projects: 9, patents: 3 },
  { branch: "IT", papers: 16, projects: 11, patents: 3 },
];

const finalApproval = [
  { branch: "CE", hod: "Dr. Sunita More", batch: 8, status: "HOD Approved", priority: "High" },
  { branch: "EE", hod: "Dr. Mohan Rao", batch: 5, status: "HOD Approved", priority: "High" },
  { branch: "IT", hod: "Dr. Sushma Pillai", batch: 6, status: "HOD Approved", priority: "Medium" },
  { branch: "MECH", hod: "Prof. Girish Shah", batch: 3, status: "Pending HOD", priority: "Low" },
];

export default function RDInchargeDashboard() {
  return (
    <Layout title="R&D Incharge Dashboard" subtitle="CAMPUS-IQ · College-Wide R&D Management">
      <StatCardGrid>
        <StatCard label="Total R&D (College)" value="146" icon={FlaskConical} color="cyan" trend={8.3} />
        <StatCard label="Awaiting Final Approval" value="7" icon={CheckSquare} color="orange" />
        <StatCard label="Active Branches" value="5" icon={Building2} color="blue" />
        <StatCard label="College R&D Score" value="91%" icon={TrendingUp} color="green" trend={5.1} />
      </StatCardGrid>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Branch-wise R&D Comparison</div>
            <div className="card-subtitle">Papers, Projects, Patents across all branches · AY 2025–26</div>
          </div>
          <button className="btn btn-secondary btn-sm"><Download size={13} /> Export</button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={branchComparison} barCategoryGap="30%">
            <XAxis dataKey="branch" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
            <Bar dataKey="papers" fill="var(--primary)" radius={[3,3,0,0]} name="Papers" />
            <Bar dataKey="projects" fill="var(--accent)" radius={[3,3,0,0]} name="Projects" />
            <Bar dataKey="patents" fill="var(--success)" radius={[3,3,0,0]} name="Patents" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Final Approval Queue */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Final Approval Queue</div>
            <div className="card-subtitle">Batches forwarded by Branch HODs for central R&D approval</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm"><CheckSquare size={13} /> Bulk Approve</button>
            <button className="btn btn-secondary btn-sm"><FileText size={13} /> Generate Report</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Branch</th><th>HOD</th><th>Batch Size</th><th>Status</th><th>Priority</th><th>Action</th></tr>
          </thead>
          <tbody>
            {finalApproval.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: "var(--text-accent)" }}>{a.branch}</td>
                <td>{a.hod}</td>
                <td><span style={{ fontWeight: 700, color: "var(--primary-light)" }}>{a.batch}</span> submissions</td>
                <td><span className={`badge ${a.status.includes("Approved") ? "success" : "warning"}`}>{a.status}</span></td>
                <td><span className={`badge ${a.priority === "High" ? "danger" : a.priority === "Medium" ? "warning" : "muted"}`}>{a.priority}</span></td>
                <td style={{ display: "flex", gap: 6 }}>
                  {a.status.includes("Approved") && <button className="btn btn-success btn-sm"><CheckSquare size={11} /> Approve</button>}
                  <button className="btn btn-secondary btn-sm"><Award size={11} /> Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
