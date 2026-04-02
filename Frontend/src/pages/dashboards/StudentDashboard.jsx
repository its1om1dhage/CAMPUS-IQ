import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import FilterBar from "../../Components/FilterBar";
import DataTable from "../../Components/DataTable";
import StatusBadge, { WorkflowPill } from "../../Components/StatusBadge";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FlaskConical, Award, Upload, Clock, BookOpen, Users, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMySubmissions, MOCK_TRENDS } from "../../services/supabase";

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTab, setActiveTab] = useState("submissions");

  useEffect(() => {
    setLoading(true);
    getMySubmissions(user?.id || "STU2024001").then(d => {
      setSubmissions(d);
      setLoading(false);
    });
  }, [user]);

  const filtered = submissions.filter(s => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.contributors.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = !statusFilter || s.status === statusFilter;
    const matchYear = !yearFilter || s.year === yearFilter;
    const matchType = !typeFilter || s.type === typeFilter;
    return matchSearch && matchStatus && matchYear && matchType;
  });

  const totalCount = submissions.length;
  const approvedCount = submissions.filter(s => s.status === "approved").length;
  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const rejectedCount = submissions.filter(s => s.status === "coord_rejected" || s.status === "rejected").length;

  const pieData = [
    { name: "Approved", value: approvedCount },
    { name: "Pending", value: pendingCount },
    { name: "Rejected", value: rejectedCount },
    { name: "In Review", value: totalCount - approvedCount - pendingCount - rejectedCount },
  ].filter(d => d.value > 0);

  const columns = [
    {
      key: "title", label: "Title", sortable: true,
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{v}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{row.contributors.join(", ")}</div>
        </div>
      )
    },
    { key: "type", label: "Type", render: v => <span className="badge info">{v}</span> },
    { key: "year", label: "Year", render: v => <span className="badge muted">{v}</span> },
    {
      key: "status", label: "Status",
      render: (v, row) => <StatusBadge status={v} remark={row.coord_remark || row.rd_remark} verifiedBy={row.coord_verified_by || row.rd_approved_by} />
    },
    {
      key: "status", label: "Workflow",
      render: (v) => <WorkflowPill status={v} />
    },
    {
      key: "submitted_at", label: "Submitted", sortable: true,
      render: v => <span className="td-muted">{v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
    },
    {
      key: "id", label: "Action",
      render: (id) => (
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/submission/${id}`)}>
          <BookOpen size={12} /> View
        </button>
      )
    },
  ];

  return (
    <Layout title="Student Dashboard" subtitle={`CAMPUS-IQ · R&D Module · ${user?.branch || "Computer Engineering"}`} pendingCount={pendingCount}>
      <StatCardGrid>
        <StatCard label="Total Submissions" value={loading ? "—" : totalCount} icon={FlaskConical} color="blue" loading={loading} />
        <StatCard label="Approved" value={loading ? "—" : approvedCount} icon={Award} color="green" trend={1} loading={loading} />
        <StatCard label="Pending Review" value={loading ? "—" : pendingCount} icon={Clock} color="orange" loading={loading} />
        <StatCard label="Rejected" value={loading ? "—" : rejectedCount} icon={Upload} color="red" loading={loading} />
      </StatCardGrid>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">My R&D Activity</div>
              <div className="card-subtitle">Submissions trend over months</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOCK_TRENDS}>
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Bar dataKey="submissions" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Status Breakdown</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pieData.map((p, i) => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{p.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginLeft: "auto" }}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">My Submissions</div>
            <div className="card-subtitle">All R&D work submitted this academic year</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <ExportButton data={filtered} filename="my_submissions" />
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/rd-submit")}>
              <Plus size={13} /> New Submission
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["submissions", "group"].map(t => (
            <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "submissions" ? `My Work (${totalCount})` : `Group Work`}
            </button>
          ))}
        </div>

        {activeTab === "submissions" && (
          <>
            <FilterBar
              search={search} onSearch={setSearch}
              status={statusFilter} onStatus={setStatusFilter}
              year={yearFilter} onYear={setYearFilter}
              type={typeFilter} onType={setTypeFilter}
              showType showDept={false}
              onReset={() => { setSearch(""); setStatusFilter(""); setYearFilter(""); setTypeFilter(""); }}
            />
            <DataTable columns={columns} data={filtered} loading={loading} emptyTitle="No submissions yet" emptySubtitle='Click "New Submission" to get started.' />
          </>
        )}

        {activeTab === "group" && (
          <div style={{ padding: "20px 0" }}>
            {submissions.filter(s => s.contributors.length > 1).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={18} style={{ color: "var(--primary-light)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {s.contributors.length} contributors: {s.contributors.join(", ")}
                  </div>
                </div>
                <StatusBadge status={s.status} compact />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
