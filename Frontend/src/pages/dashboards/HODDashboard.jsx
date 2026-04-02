import { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import FilterBar from "../../Components/FilterBar";
import DataTable from "../../Components/DataTable";
import StatusBadge from "../../Components/StatusBadge";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, CheckSquare, Clock, TrendingUp, Calendar, AlertTriangle, Target } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getSubmissions, MOCK_DEPT_STATS } from "../../services/supabase";

export default function HODDashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    getSubmissions({ department: "Computer Science & Engineering" }).then(d => {
      setSubmissions(d);
      setLoading(false);
    });
  }, []);

  const totalCount = submissions.length;
  const approvedCount = submissions.filter(s => s.status === "approved").length;
  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const approvalRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  // Faculty activity (mock grouped)
  const facultyActivity = [
    { name: "Dr. Priya Patil", submissions: 4, approved: 3, role: "Faculty" },
    { name: "Prof. Amit Kulkarni", submissions: 6, approved: 5, role: "Coordinator" },
    { name: "Ms. Anjali Singh", submissions: 3, approved: 2, role: "Faculty" },
    { name: "Dr. Anil Joshi", submissions: 2, approved: 2, role: "Faculty" },
    { name: "Mr. Ravi Kumar", submissions: 5, approved: 3, role: "Faculty" },
  ];

  const categoryData = [
    { name: "Research Papers", value: 8 },
    { name: "Projects", value: 6 },
    { name: "Patents", value: 2 },
    { name: "Conference", value: 5 },
    { name: "Journal", value: 4 },
  ];

  const filetred = submissions.filter(s =>
    (!search || s.title.toLowerCase().includes(search.toLowerCase()) || s.submitted_by.name.toLowerCase().includes(search.toLowerCase()))
    && (!statusFilter || s.status === statusFilter)
    && (!yearFilter || s.year === yearFilter)
  );

  const submissionColumns = [
    { key: "title", label: "Title", sortable: true, render: (v, row) => <div><div style={{ fontWeight: 600 }}>{v}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>{row.type}</div></div> },
    { key: "submitted_by", label: "By", render: v => <div><div style={{ fontWeight: 500 }}>{v?.name}</div><span className={`badge ${v?.role === "student" ? "info" : "primary"}`} style={{ fontSize: 10 }}>{v?.role}</span></div> },
    { key: "year", label: "Year", render: v => <span className="badge muted">{v}</span> },
    { key: "status", label: "Status", render: (v, row) => <StatusBadge status={v} remark={row.coord_remark} compact /> },
    { key: "submitted_at", label: "Date", sortable: true, render: v => <span className="td-muted">{v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}</span> },
  ];

  const facultyColumns = [
    { key: "name", label: "Faculty", render: v => <div style={{ fontWeight: 600 }}>{v}</div> },
    { key: "role", label: "Role", render: v => <span className="badge primary">{v}</span> },
    { key: "submissions", label: "Submissions", render: v => <span style={{ fontWeight: 700, color: "var(--primary-light)" }}>{v}</span> },
    { key: "approved", label: "Approved", render: v => <span style={{ fontWeight: 700, color: "var(--success)" }}>{v}</span> },
    {
      key: "submissions", label: "Rate",
      render: (v, row) => {
        const rate = Math.round((row.approved / row.submissions) * 100);
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{rate}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill green" style={{ width: `${rate}%` }} />
            </div>
          </div>
        );
      }
    },
  ];

  return (
    <Layout title="HOD Dashboard" subtitle={`CAMPUS-IQ · ${user?.branch || "Computer Engineering"} · Department Management`} pendingCount={pendingCount}>
      <StatCardGrid>
        <StatCard label="Total Submissions" value={loading ? "—" : totalCount} icon={TrendingUp} color="blue" loading={loading} trend={12.5} />
        <StatCard label="Approval Rate" value={loading ? "—" : `${approvalRate}%`} icon={CheckSquare} color="green" loading={loading} />
        <StatCard label="Pending Items" value={loading ? "—" : pendingCount} icon={Clock} color="orange" loading={loading} />
        <StatCard label="Active Faculty" value={facultyActivity.length} icon={Users} color="purple" />
      </StatCardGrid>

      {/* Deadline Alert */}
      <div className="alert-banner warning" style={{ marginBottom: 20 }}>
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        <div>Monthly deadline: <strong>March 31, 2026</strong> · {pendingCount} submissions still pending coordinator review · <strong>Send reminder</strong></div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Department Center</div>
          <div style={{ display: "flex", gap: 8 }}>
            <ExportButton data={submissions} filename="hod_department_report" label="Export Dept. Data" />
          </div>
        </div>

        <div className="tabs">
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "submissions", label: `📋 Submissions (${totalCount})` },
            { key: "faculty", label: "👥 Faculty Activity" },
          ].map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div>
            <div className="grid-2" style={{ marginTop: 8 }}>
              {/* Category breakdown */}
              <div>
                <div className="card-title" style={{ marginBottom: 18 }}>Submissions by Category</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {categoryData.map(item => {
                    const max = Math.max(...categoryData.map(d => d.value));
                    return (
                      <div key={item.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.name}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{item.value}</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill blue" style={{ width: `${(item.value / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Workflow monitor */}
              <div>
                <div className="card-title" style={{ marginBottom: 18 }}>Workflow Monitor</div>
                {[
                  { label: "Submitted / Draft", value: submissions.filter(s => s.status === "pending" || s.status === "draft").length, color: "var(--warning)" },
                  { label: "Coord. Verified", value: submissions.filter(s => s.status === "coord_approved").length, color: "var(--info)" },
                  { label: "R&D Approved", value: submissions.filter(s => s.status === "approved").length, color: "var(--success)" },
                  { label: "Rejected", value: submissions.filter(s => s.status === "coord_rejected" || s.status === "rejected").length, color: "var(--danger)" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: item.color, fontFamily: "Outfit" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals panel */}
            <div style={{ marginTop: 24, padding: "18px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Target size={16} style={{ color: "var(--primary-light)" }} />
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Department Targets 2025–26</span>
              </div>
              <div className="grid-3">
                {[
                  { label: "Research Papers", target: 20, current: 18 },
                  { label: "Projects", target: 15, current: 12 },
                  { label: "Patents", target: 5, current: 2 },
                ].map(g => (
                  <div key={g.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{g.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{g.current}/{g.target}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill green" style={{ width: `${Math.min((g.current / g.target) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "submissions" && (
          <>
            <FilterBar
              search={search} onSearch={setSearch}
              status={statusFilter} onStatus={setStatusFilter}
              year={yearFilter} onYear={setYearFilter}
              onReset={() => { setSearch(""); setStatusFilter(""); setYearFilter(""); }}
            />
            <DataTable columns={submissionColumns} data={filetred} loading={loading} />
          </>
        )}

        {activeTab === "faculty" && (
          <DataTable columns={facultyColumns} data={facultyActivity} loading={false} emptyTitle="No faculty data" />
        )}
      </div>
    </Layout>
  );
}
