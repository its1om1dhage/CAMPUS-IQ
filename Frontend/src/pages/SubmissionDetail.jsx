import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import StatusBadge, { WorkflowPill } from "../Components/StatusBadge";
import { MOCK_SUBMISSIONS } from "../services/supabase";
import { ArrowLeft, Users, Calendar, Building2, FileText, MessageSquare } from "lucide-react";

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const submission = MOCK_SUBMISSIONS.find(s => s.id === id) || MOCK_SUBMISSIONS[0];

  if (!submission) return null;

  const fmt = (date) => date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <Layout title="Submission Details" subtitle="CAMPUS-IQ · R&D Module · Full Record View">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Back button */}
        <button className="btn btn-secondary btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>

        {/* Title Card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "Outfit", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.3 }}>
                {submission.title}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span className="badge info">{submission.type}</span>
                <span className="badge muted">{submission.year}</span>
                <StatusBadge status={submission.status} compact />
              </div>
            </div>
          </div>

          {/* Workflow Timeline */}
          <div style={{ padding: "20px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", marginTop: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
              Workflow Status
            </div>
            <WorkflowPill status={submission.status} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid-2" style={{ marginBottom: 20 }}>
          {/* Submission Info */}
          <div className="card">
            <div className="card-header"><div className="card-title">Submission Info</div></div>
            {[
              { icon: FileText, label: "Type", value: submission.type },
              { icon: Calendar, label: "Academic Year", value: submission.year },
              { icon: Building2, label: "Department", value: submission.department },
              { icon: Calendar, label: "Submitted On", value: fmt(submission.submitted_at) },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                <item.icon size={15} style={{ color: "var(--text-muted)", marginTop: 1, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contributors */}
          <div className="card">
            <div className="card-header"><div className="card-title">Contributors</div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {submission.contributors.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg, var(--primary), var(--accent))" : "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", color: i === 0 ? "white" : "var(--text-muted)", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {c[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{c}</div>
                    {i === 0 && <div style={{ fontSize: 11, color: "var(--text-accent)" }}>Primary Contributor</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Trail */}
        <div className="card">
          <div className="card-header"><div className="card-title">Verification Trail</div></div>
          <div className="activity-list">
            {/* Submitted */}
            <div className="activity-item">
              <div className="activity-dot info">📤</div>
              <div className="activity-body">
                <div className="activity-title">Submitted by {submission.submitted_by.name}</div>
                <div className="activity-meta">{fmt(submission.submitted_at)}</div>
              </div>
            </div>

            {/* Coordinator */}
            {submission.coord_verified_by ? (
              <div className="activity-item">
                <div className={`activity-dot ${submission.status === "coord_rejected" ? "danger" : "success"}`}>
                  {submission.status === "coord_rejected" ? "✕" : "✓"}
                </div>
                <div className="activity-body">
                  <div className="activity-title">
                    {submission.status === "coord_rejected" ? "Rejected" : "Verified"} by Coordinator: {submission.coord_verified_by}
                  </div>
                  <div className="activity-meta">{fmt(submission.coord_verified_at)}</div>
                  {submission.coord_remark && (
                    <div style={{ marginTop: 6, padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-secondary)", borderLeft: "2px solid var(--border-accent)" }}>
                      <MessageSquare size={11} style={{ display: "inline", marginRight: 5 }} />
                      "{submission.coord_remark}"
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="activity-item">
                <div className="activity-dot warning">⏳</div>
                <div className="activity-body">
                  <div className="activity-title">Awaiting Coordinator Verification</div>
                  <div className="activity-meta">Pending</div>
                </div>
              </div>
            )}

            {/* R&D */}
            {submission.rd_approved_by ? (
              <div className="activity-item">
                <div className={`activity-dot ${submission.status === "rejected" ? "danger" : "success"}`}>
                  {submission.status === "rejected" ? "✕" : "🎯"}
                </div>
                <div className="activity-body">
                  <div className="activity-title">
                    {submission.status === "rejected" ? "Finally Rejected" : "Finally Approved"} by R&D: {submission.rd_approved_by}
                  </div>
                  <div className="activity-meta">{fmt(submission.rd_approved_at)}</div>
                  {submission.rd_remark && (
                    <div style={{ marginTop: 6, padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-secondary)", borderLeft: "2px solid var(--success)" }}>
                      <MessageSquare size={11} style={{ display: "inline", marginRight: 5 }} />
                      "{submission.rd_remark}"
                    </div>
                  )}
                </div>
              </div>
            ) : submission.coord_verified_by && submission.status !== "coord_rejected" ? (
              <div className="activity-item">
                <div className="activity-dot warning">⏳</div>
                <div className="activity-body">
                  <div className="activity-title">Awaiting R&D Incharge Final Decision</div>
                  <div className="activity-meta">Pending</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
