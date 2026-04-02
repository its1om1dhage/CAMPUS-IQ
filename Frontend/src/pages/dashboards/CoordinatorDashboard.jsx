import { useState, useEffect, useCallback } from "react";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import FilterBar from "../../Components/FilterBar";
import DataTable from "../../Components/DataTable";
import StatusBadge from "../../Components/StatusBadge";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckSquare, Clock, Users, AlertTriangle, XCircle, Eye, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getSubmissions, updateSubmissionStatus } from "../../services/supabase";

// Remark Modal
function RemarkModal({ item, actionType, onConfirm, onClose }) {
  const [remark, setRemark] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div className="card" style={{ width: 480 }}>
        <div className="card-header">
          <div>
            <div className="card-title">{actionType === "approve" ? "✅ Verify Submission" : "❌ Reject Submission"}</div>
            <div className="card-subtitle" style={{ maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
          </div>
          <button className="header-btn" onClick={onClose}>✕</button>
        </div>
        <div className="form-group">
          <label className="form-label">Remark {actionType === "reject" ? "(Required)" : "(Optional)"}</label>
          <textarea className="form-textarea" placeholder={actionType === "approve" ? "Add a verification remark..." : "State the reason for rejection..."} value={remark} onChange={e => setRemark(e.target.value)} />
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
            {actionType === "approve" ? "Confirm Verify" : "Confirm Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

const weeklyData = [
  { week: "W1", submitted: 4, verified: 3 },
  { week: "W2", submitted: 6, verified: 5 },
  { week: "W3", submitted: 3, verified: 3 },
  { week: "W4", submitted: 8, verified: 6 },
];

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [yearFilter, setYearFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [modal, setModal] = useState(null); // { item, actionType }
  const [processing, setProcessing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getSubmissions({ department: user?.branch || "Computer Science & Engineering" }).then(d => {
      setSubmissions(d);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (remark) => {
    if (!modal) return;
    setProcessing(modal.item.id);
    const newStatus = modal.actionType === "approve" ? "coord_approved" : "coord_rejected";
    await updateSubmissionStatus(modal.item.id, newStatus, remark, user?.name);
    setSubmissions(prev => prev.map(s => s.id === modal.item.id ? { ...s, status: newStatus, coord_remark: remark, coord_verified_by: user?.name } : s));
    setModal(null);
    setProcessing(null);
  };

  const byTab = {
    pending: submissions.filter(s => s.status === "pending"),
    approved: submissions.filter(s => s.status === "coord_approved" || s.status === "approved"),
    rejected: submissions.filter(s => s.status === "coord_rejected" || s.status === "rejected"),
  };

  const filtered = (byTab[activeTab] || []).filter(s => {
    const q = search.toLowerCase();
    return (!search || s.title.toLowerCase().includes(q) || s.submitted_by.name.toLowerCase().includes(q) || s.contributors.some(c => c.toLowerCase().includes(q)))
      && (!yearFilter || s.year === yearFilter)
      && (!typeFilter || s.type === typeFilter);
  });

  const pendingCount = byTab.pending.length;
  const overdueCount = 2; // mock

  const columns = [
    {
      key: "title", label: "Title", sortable: true,
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{v}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{row.contributors.join(", ")}</div>
        </div>
      )
    },
    { key: "submitted_by", label: "Submitter", render: v => <div><div style={{ fontWeight: 500 }}>{v?.name}</div><span className={`badge ${v?.role === "student" ? "info" : "primary"}`} style={{ fontSize: 10, marginTop: 2 }}>{v?.role}</span></div> },
    { key: "type", label: "Type", render: v => <span className="badge muted">{v}</span> },
    { key: "year", label: "Year", render: v => <span className="td-muted">{v}</span> },
    {
      key: "submitted_at", label: "Submitted", sortable: true,
      render: v => <span className="td-muted">{v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}</span>
    },
    {
      key: "status", label: "Status",
      render: (v, row) => <StatusBadge status={v} remark={row.coord_remark} verifiedBy={row.coord_verified_by} />
    },
    {
      key: "id", label: "Actions",
      render: (id, row) => (
        <div style={{ display: "flex", gap: 6 }}>
          {activeTab === "pending" ? (
            <>
              <button
                className="btn btn-success btn-sm"
                disabled={processing === id}
                onClick={() => setModal({ item: row, actionType: "approve" })}
              >
                <CheckSquare size={11} /> Verify
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={processing === id}
                onClick={() => setModal({ item: row, actionType: "reject" })}
              >
                <XCircle size={11} /> Reject
              </button>
            </>
          ) : (
            <button className="btn btn-secondary btn-sm"><Eye size={11} /> View</button>
          )}
        </div>
      )
    },
  ];

  return (
    <Layout title="Coordinator Dashboard" subtitle={`CAMPUS-IQ · ${user?.branch || "Computer Engineering"} · Verification Panel`} pendingCount={pendingCount}>
      {modal && <RemarkModal item={modal.item} actionType={modal.actionType} onConfirm={handleAction} onClose={() => setModal(null)} />}

      {pendingCount > 0 && (
        <div className="alert-banner warning" style={{ marginBottom: 20 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <div><strong>{pendingCount} submissions</strong> are awaiting your verification. Deadline: <strong>March 31, 2026</strong>.</div>
        </div>
      )}

      <StatCardGrid>
        <StatCard label="Pending Verification" value={loading ? "—" : pendingCount} icon={Clock} color="orange" loading={loading} />
        <StatCard label="Verified This Month" value={loading ? "—" : byTab.approved.length} icon={CheckSquare} color="green" trend={4.2} loading={loading} />
        <StatCard label="Rejected" value={loading ? "—" : byTab.rejected.length} icon={XCircle} color="red" loading={loading} />
        <StatCard label="Overdue Items" value={overdueCount} icon={AlertTriangle} color="red" />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Verification Progress</div><div className="card-subtitle">Submitted vs Verified per week</div></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barCategoryGap="35%">
              <XAxis dataKey="week" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Bar dataKey="submitted" fill="rgba(79,70,229,0.3)" radius={[4, 4, 0, 0]} name="Submitted" />
              <Bar dataKey="verified" fill="var(--success)" radius={[4, 4, 0, 0]} name="Verified" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Verification Summary</div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Total Received", value: submissions.length, color: "var(--primary-light)" },
              { label: "Verified", value: byTab.approved.length, color: "var(--success)" },
              { label: "Pending", value: pendingCount, color: "var(--warning)" },
              { label: "Rejected", value: byTab.rejected.length, color: "var(--danger)" },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill blue" style={{ width: `${submissions.length > 0 ? (item.value / submissions.length) * 100 : 0}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Panel */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Verification Panel</div>
            <div className="card-subtitle">Review, approve, or reject department submissions</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <ExportButton data={filtered} filename="coordinator_verification" />
            {activeTab === "pending" && pendingCount > 0 && (
              <button className="btn btn-success btn-sm"><CheckSquare size={13} /> Bulk Approve</button>
            )}
          </div>
        </div>

        <div className="tabs">
          {[
            { key: "pending", label: `⏳ Pending (${byTab.pending.length})` },
            { key: "approved", label: `✅ Verified (${byTab.approved.length})` },
            { key: "rejected", label: `❌ Rejected (${byTab.rejected.length})` },
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
          showType showDept={false} showStatus={false}
          onReset={() => { setSearch(""); setYearFilter(""); setTypeFilter(""); }}
        />

        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyTitle={`No ${activeTab} submissions`}
          emptySubtitle="All caught up!"
        />
      </div>
    </Layout>
  );
}
