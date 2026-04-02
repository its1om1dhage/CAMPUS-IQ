import { useState, useEffect, useCallback } from "react";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import FilterBar from "../../Components/FilterBar";
import DataTable from "../../Components/DataTable";
import StatusBadge from "../../Components/StatusBadge";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { FlaskConical, CheckSquare, Building2, TrendingUp, FileText, Download, XCircle, Eye, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getSubmissions, finalApproveSubmission, MOCK_DEPT_STATS, MOCK_TRENDS } from "../../services/supabase";

// Approval Remark Modal
function ApprovalModal({ item, actionType, onConfirm, onClose }) {
  const [remark, setRemark] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div className="card" style={{ width: 520 }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ fontSize: 16 }}>
              {actionType === "approve" ? "🎯 Final R&D Approval" : "🚫 Reject Submission"}
            </div>
            <div className="card-subtitle" style={{ maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
          </div>
          <button className="header-btn" onClick={onClose}>✕</button>
        </div>

        <div className="alert-banner info" style={{ marginBottom: 14 }}>
          <div>
            <strong>Coordinator:</strong> {item.coord_verified_by || "N/A"} ·
            <strong> Dept:</strong> {item.department} ·
            <strong> Type:</strong> {item.type}
          </div>
        </div>

        {item.coord_remark && (
          <div style={{ marginBottom: 14, padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", fontSize: 12, color: "var(--text-secondary)", borderLeft: "3px solid var(--info)" }}>
            <strong>Coordinator Remark:</strong> "{item.coord_remark}"
          </div>
        )}

        <div className="form-group">
          <label className="form-label">R&D Incharge Remark {actionType === "reject" ? "(Required)" : "(Optional)"}</label>
          <textarea className="form-textarea" placeholder={`Add final ${actionType === "approve" ? "approval" : "rejection"} remark...`} value={remark} onChange={e => setRemark(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className={`btn ${actionType === "approve" ? "btn-success" : "btn-danger"}`}
            style={{ flex: 1 }}
            disabled={actionType === "reject" && !remark.trim()}
            onClick={() => onConfirm(remark)}
          >
            {actionType === "approve" ? <CheckSquare size={14} /> : <XCircle size={14} />}
            {actionType === "approve" ? "Final Approve" : "Final Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RDInchargeDashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("coord_approved");
  const [yearFilter, setYearFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTab, setActiveTab] = useState("approval");
  const [modal, setModal] = useState(null);
  const [processing, setProcessing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getSubmissions().then(d => { setSubmissions(d); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFinalAction = async (remark) => {
    if (!modal) return;
    setProcessing(modal.item.id);
    const newStatus = modal.actionType === "approve" ? "approved" : "rejected";
    await finalApproveSubmission(modal.item.id, newStatus, remark, user?.name);
    setSubmissions(prev => prev.map(s => s.id === modal.item.id ? { ...s, status: newStatus, rd_remark: remark, rd_approved_by: user?.name } : s));
    setModal(null);
    setProcessing(null);
  };

  const coordApproved = submissions.filter(s => s.status === "coord_approved");
  const rdApproved = submissions.filter(s => s.status === "approved");
  const rdRejected = submissions.filter(s => s.status === "rejected");
  const pendingAtCoord = submissions.filter(s => s.status === "pending");

  const displayData = activeTab === "approval" ? coordApproved : activeTab === "approved" ? rdApproved : activeTab === "rejected" ? rdRejected : submissions;

  const filtered = displayData.filter(s => {
    const q = search.toLowerCase();
    return (!search || s.title.toLowerCase().includes(q) || s.submitted_by.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q))
      && (!yearFilter || s.year === yearFilter)
      && (!typeFilter || s.type === typeFilter)
      && (!deptFilter || s.department === deptFilter);
  });

  const approvalColumns = [
    {
      key: "title", label: "Title", sortable: true,
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{v}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{row.contributors.join(", ")}</div>
        </div>
      )
    },
    { key: "submitted_by", label: "Submitter", render: v => <div><div style={{ fontWeight: 500 }}>{v?.name}</div><span className={`badge ${v?.role === "student" ? "info" : "primary"}`} style={{ fontSize: 10 }}>{v?.role}</span></div> },
    { key: "department", label: "Department", render: v => <span style={{ fontSize: 12, color: "var(--text-accent)" }}>{v}</span> },
    { key: "type", label: "Type", render: v => <span className="badge muted">{v}</span> },
    { key: "status", label: "Status", render: (v, row) => <StatusBadge status={v} remark={row.coord_remark} verifiedBy={row.coord_verified_by} /> },
    {
      key: "submitted_at", label: "Date", sortable: true,
      render: v => <span className="td-muted">{v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}</span>
    },
    {
      key: "id", label: "Actions",
      render: (id, row) => (
        <div style={{ display: "flex", gap: 6 }}>
          {activeTab === "approval" ? (
            <>
              <button className="btn btn-success btn-sm" disabled={processing === id} onClick={() => setModal({ item: row, actionType: "approve" })}><CheckSquare size={11} /> Approve</button>
              <button className="btn btn-danger btn-sm" disabled={processing === id} onClick={() => setModal({ item: row, actionType: "reject" })}><XCircle size={11} /> Reject</button>
            </>
          ) : (
            <button className="btn btn-secondary btn-sm"><Eye size={11} /> View</button>
          )}
        </div>
      )
    },
  ];

  return (
    <Layout title="R&D Incharge Dashboard" subtitle="CAMPUS-IQ · College-Wide R&D Management · Final Approval System" pendingCount={coordApproved.length}>
      {modal && <ApprovalModal item={modal.item} actionType={modal.actionType} onConfirm={handleFinalAction} onClose={() => setModal(null)} />}

      <StatCardGrid>
        <StatCard label="Total College R&D" value={loading ? "—" : submissions.length} icon={FlaskConical} color="cyan" trend={8.3} loading={loading} />
        <StatCard label="Awaiting Final Approval" value={loading ? "—" : coordApproved.length} icon={CheckSquare} color="orange" loading={loading} />
        <StatCard label="R&D Approved" value={loading ? "—" : rdApproved.length} icon={TrendingUp} color="green" loading={loading} />
        <StatCard label="Active Departments" value={MOCK_DEPT_STATS.length} icon={Building2} color="blue" />
      </StatCardGrid>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Branch-wise R&D Comparison</div><div className="card-subtitle">Papers, Projects, Patents · AY 2025-26</div></div>
            <ExportButton data={MOCK_DEPT_STATS} filename="branch_rd_comparison" label="Export" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_DEPT_STATS} barCategoryGap="30%">
              <XAxis dataKey="short" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }} />
              <Bar dataKey="papers" fill="var(--primary)" radius={[3, 3, 0, 0]} name="Papers" />
              <Bar dataKey="projects" fill="var(--accent)" radius={[3, 3, 0, 0]} name="Projects" />
              <Bar dataKey="patents" fill="var(--success)" radius={[3, 3, 0, 0]} name="Patents" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><div><div className="card-title">Submission Trends</div><div className="card-subtitle">College-wide monthly trend</div></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK_TRENDS}>
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Line type="monotone" dataKey="submissions" stroke="var(--primary-light)" strokeWidth={2.5} dot={{ fill: "var(--primary)", r: 4 }} name="Submissions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Rankings */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">Department Performance Rankings</div>
          <ExportButton data={MOCK_DEPT_STATS} filename="dept_rankings" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {MOCK_DEPT_STATS.sort((a, b) => b.total - a.total).map((dept, i) => (
            <div key={dept.dept} style={{ padding: "14px 16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: `1px solid ${i === 0 ? "var(--warning)" : i === 1 ? "var(--border-strong)" : "var(--border)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "var(--warning)" : i === 1 ? "var(--text-secondary)" : "var(--text-muted)" }}>#{i + 1}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{dept.short}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 20, color: "var(--text-primary)", fontFamily: "Outfit" }}>{dept.total}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>entries · {Math.round((dept.approved / dept.total) * 100)}% approved</div>
              <div className="progress-track" style={{ marginTop: 8 }}>
                <div className="progress-fill green" style={{ width: `${(dept.approved / dept.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Approval Panel */}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">Final Approval System</div><div className="card-subtitle">College-wide submissions requiring R&D decision</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            <ExportButton data={filtered} filename="rd_final_approval" />
            {activeTab === "approval" && coordApproved.length > 0 && (
              <button className="btn btn-success btn-sm"><CheckSquare size={13} /> Bulk Approve</button>
            )}
          </div>
        </div>

        <div className="tabs">
          {[
            { key: "approval", label: `⏳ Awaiting Final (${coordApproved.length})` },
            { key: "approved", label: `✅ R&D Approved (${rdApproved.length})` },
            { key: "rejected", label: `❌ Rejected (${rdRejected.length})` },
            { key: "all", label: `📋 All (${submissions.length})` },
          ].map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        <FilterBar
          search={search} onSearch={setSearch}
          year={yearFilter} onYear={setYearFilter}
          type={typeFilter} onType={setTypeFilter}
          department={deptFilter} onDepartment={setDeptFilter}
          showType showDept showStatus={false}
          onReset={() => { setSearch(""); setYearFilter(""); setTypeFilter(""); setDeptFilter(""); }}
        />

        <DataTable
          columns={approvalColumns}
          data={filtered}
          loading={loading}
          emptyTitle={`No ${activeTab === "approval" ? "submissions awaiting approval" : activeTab + " submissions"}`}
          emptySubtitle="All caught up!"
        />
      </div>
    </Layout>
  );
}
