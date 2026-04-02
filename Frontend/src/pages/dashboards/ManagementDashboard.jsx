import { useState } from "react";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import FilterBar from "../../Components/FilterBar";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Building2, TrendingUp, Target, Award } from "lucide-react";
import { MOCK_DEPT_STATS, ACADEMIC_YEARS } from "../../services/supabase";

export default function ManagementDashboard() {
  const [deptFilter, setDeptFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("2024-25");

  const totalSubmissions = MOCK_DEPT_STATS.reduce((a, d) => a + d.total, 0);
  const totalApproved = MOCK_DEPT_STATS.reduce((a, d) => a + d.approved, 0);
  const totalPatents = MOCK_DEPT_STATS.reduce((a, d) => a + d.patents, 0);
  const approvalRate = Math.round((totalApproved / totalSubmissions) * 100);

  const filteredDepts = deptFilter ? MOCK_DEPT_STATS.filter(d => d.dept === deptFilter || d.short === deptFilter) : MOCK_DEPT_STATS;

  return (
    <Layout title="Management Dashboard" subtitle="CAMPUS-IQ · College Management · High-Level View">
      <StatCardGrid>
        <StatCard label="Total R&D Entries" value={totalSubmissions} icon={TrendingUp} color="blue" />
        <StatCard label="Approval Rate" value={`${approvalRate}%`} icon={Award} color="green" />
        <StatCard label="Total Patents" value={totalPatents} icon={Target} color="cyan" />
        <StatCard label="Departments" value={MOCK_DEPT_STATS.length} icon={Building2} color="purple" />
      </StatCardGrid>

      <div className="card">
        <div className="card-header">
          <div><div className="card-title">Management Overview</div><div className="card-subtitle">High-level R&D stats by department and year</div></div>
          <ExportButton data={filteredDepts} filename="management_report" label="Export Report" />
        </div>

        {/* Simple year + dept filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <select className="form-select" value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ width: "auto", minWidth: 130, height: 36, padding: "0 12px" }}>
            <option value="">All Years</option>
            {ACADEMIC_YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
          <select className="form-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ width: "auto", minWidth: 130, height: 36, padding: "0 12px" }}>
            <option value="">All Departments</option>
            {MOCK_DEPT_STATS.map(d => <option key={d.dept} value={d.short}>{d.dept}</option>)}
          </select>
        </div>

        <div className="grid-2">
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14 }}>Submission Summary by Department</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={filteredDepts} barCategoryGap="35%">
                <XAxis dataKey="short" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="approved" fill="var(--success)" radius={[3, 3, 0, 0]} name="Approved" />
                <Bar dataKey="pending" fill="var(--warning)" radius={[3, 3, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 14 }}>Department Stats</div>
            <table className="data-table">
              <thead>
                <tr><th>Dept</th><th>Total</th><th>Approved</th><th>Rate</th></tr>
              </thead>
              <tbody>
                {filteredDepts.map(d => (
                  <tr key={d.dept}>
                    <td style={{ fontWeight: 600 }}>{d.short}</td>
                    <td>{d.total}</td>
                    <td style={{ color: "var(--success)", fontWeight: 600 }}>{d.approved}</td>
                    <td>
                      <span className={`badge ${Math.round((d.approved / d.total) * 100) > 80 ? "success" : "warning"}`}>
                        {Math.round((d.approved / d.total) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
