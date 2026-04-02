import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import FilterBar from "../../Components/FilterBar";
import DataTable from "../../Components/DataTable";
import StatusBadge from "../../Components/StatusBadge";
import ExportButton from "../../Components/ExportButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FlaskConical, Users, BookOpen, Clock, Plus, Eye, Edit2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getSubmissions, MOCK_TRENDS } from "../../services/supabase";

// Submission Modal
function AddSubmissionModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", type: "Research Paper", year: "2024-25", description: "", contributors: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div className="card" style={{ width: 540, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <div className="card-header">
          <div>
            <div className="card-title">New R&D Submission</div>
            <div className="card-subtitle">Step {step} of 2</div>
          </div>
          <button className="header-btn" onClick={onClose}>✕</button>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 99, background: s <= step ? "var(--primary)" : "var(--border)", transition: "background 0.3s" }} />
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="Enter submission title" value={form.title} onChange={e => set("title", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
                  {["Research Paper","Conference Paper","Journal Publication","Patent","Project","Book Chapter","Award","Funded Project"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Academic Year *</label>
                <select className="form-select" value={form.year} onChange={e => set("year", e.target.value)}>
                  {["2022-23","2023-24","2024-25","2025-26"].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Brief description of the work..." value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!form.title}>
              Next: Contributors →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Other Contributors (comma-separated)</label>
              <input className="form-input" placeholder="e.g., Dr. Priya Patil, Arjun Kumar" value={form.contributors} onChange={e => set("contributors", e.target.value)} />
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>You will be automatically added as the primary contributor</div>
            </div>
            <div className="alert-banner info">
              <div>Shared records will appear on all contributor profiles. No duplicate entries allowed.</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
                ✓ Submit for Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("mine");

  useEffect(() => {
    setLoading(true);
    getSubmissions({ department: "Computer Science & Engineering" }).then(d => {
      setSubmissions(d);
      setLoading(false);
    });
  }, []);

  const mySubmissions = submissions.filter(s => s.submitted_by.role === "faculty");
  const studentSubmissions = submissions.filter(s => s.submitted_by.role === "student");
  const activeData = activeTab === "mine" ? mySubmissions : studentSubmissions;

  const filtered = activeData.filter(s => {
    const q = search.toLowerCase();
    return (!search || s.title.toLowerCase().includes(q) || s.submitted_by.name.toLowerCase().includes(q))
      && (!statusFilter || s.status === statusFilter)
      && (!yearFilter || s.year === yearFilter);
  });

  const pendingCount = mySubmissions.filter(s => s.status === "pending").length;

  const columns = [
    {
      key: "title", label: "Title", sortable: true,
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{v}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{row.type}</div>
        </div>
      )
    },
    { key: "submitted_by", label: "Submitted By", render: v => v?.name || "—" },
    { key: "year", label: "Year", render: v => <span className="badge muted">{v}</span> },
    { key: "status", label: "Status", render: (v, row) => <StatusBadge status={v} remark={row.coord_remark} verifiedBy={row.coord_verified_by} /> },
    {
      key: "submitted_at", label: "Date", sortable: true,
      render: v => <span className="td-muted">{v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}</span>
    },
    {
      key: "id", label: "Actions",
      render: (id, row) => (
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/submission/${id}`)}><Eye size={11} /></button>
          {row.submitted_by.role === "faculty" && <button className="btn btn-secondary btn-sm"><Edit2 size={11} /></button>}
        </div>
      )
    },
  ];

  return (
    <Layout title="Faculty Dashboard" subtitle={`CAMPUS-IQ · ${user?.branch} · R&D Module`} pendingCount={pendingCount}>
      {showModal && <AddSubmissionModal onClose={() => setShowModal(false)} />}

      <StatCardGrid>
        <StatCard label="My Submissions" value={loading ? "—" : mySubmissions.length} icon={FlaskConical} color="blue" loading={loading} />
        <StatCard label="Students Guided" value={loading ? "—" : studentSubmissions.length} icon={Users} color="purple" loading={loading} />
        <StatCard label="Pending Review" value={loading ? "—" : pendingCount} icon={Clock} color="orange" loading={loading} />
        <StatCard label="Approved" value={loading ? "—" : mySubmissions.filter(s => s.status === "approved").length} icon={BookOpen} color="green" trend={2} loading={loading} />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Monthly Activity</div><div className="card-subtitle">Submissions trend</div></div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOCK_TRENDS}>
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Bar dataKey="submissions" fill="var(--success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Quick Actions</div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Add New Submission", icon: Plus, action: () => setShowModal(true), color: "btn-primary" },
              { label: "View All Submissions", icon: BookOpen, action: () => setActiveTab("mine"), color: "btn-secondary" },
              { label: "Student Activity", icon: Users, action: () => setActiveTab("students"), color: "btn-secondary" },
              { label: "Export My Data", icon: BookOpen, action: () => {}, color: "btn-secondary" },
            ].map(a => (
              <button key={a.label} className={`btn ${a.color}`} style={{ justifyContent: "flex-start" }} onClick={a.action}>
                <a.icon size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div><div className="card-title">Submissions</div><div className="card-subtitle">Track all R&D entries</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            <ExportButton data={filtered} filename="faculty_submissions" />
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={13} /> Add</button>
          </div>
        </div>
        <div className="tabs">
          <button className={`tab ${activeTab === "mine" ? "active" : ""}`} onClick={() => setActiveTab("mine")}>My Submissions ({mySubmissions.length})</button>
          <button className={`tab ${activeTab === "students" ? "active" : ""}`} onClick={() => setActiveTab("students")}>Students ({studentSubmissions.length})</button>
        </div>
        <FilterBar
          search={search} onSearch={setSearch}
          status={statusFilter} onStatus={setStatusFilter}
          year={yearFilter} onYear={setYearFilter}
          onReset={() => { setSearch(""); setStatusFilter(""); setYearFilter(""); }}
        />
        <DataTable columns={columns} data={filtered} loading={loading} />
      </div>
    </Layout>
  );
}
