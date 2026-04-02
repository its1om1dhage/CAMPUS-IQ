// StatusBadge — shows workflow status with colored dot + optional remarks tooltip
export default function StatusBadge({ status, remark, verifiedBy, compact = false }) {
  const cfg = {
    draft:            { label: "Draft",             color: "muted",   dot: "#6b7095" },
    pending:          { label: "Pending",            color: "warning", dot: "#f59e0b" },
    coord_approved:   { label: "Coord. Approved",   color: "info",    dot: "#3b82f6" },
    coord_rejected:   { label: "Coord. Rejected",   color: "danger",  dot: "#ef4444" },
    approved:         { label: "R&D Approved",       color: "success", dot: "#10b981" },
    rejected:         { label: "Rejected",           color: "danger",  dot: "#ef4444" },
  };
  const c = cfg[status] || cfg["pending"];

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
      <span className={`badge ${c.color}`} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
        {c.label}
      </span>
      {!compact && remark && (
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", maxWidth: 220, lineHeight: 1.4 }}>
          "{remark}"
          {verifiedBy && <span style={{ color: "var(--text-accent)" }}> — {verifiedBy}</span>}
        </span>
      )}
    </div>
  );
}

// WorkflowPill — compact inline workflow indicator
export function WorkflowPill({ status }) {
  const steps = [
    { key: "submitted", label: "Submitted" },
    { key: "coord",     label: "Coordinator" },
    { key: "rd",        label: "R&D Final" },
  ];

  const getStep = (s) => {
    if (s === "draft") return -1;
    if (s === "pending") return 0;
    if (s === "coord_approved") return 1;
    if (s === "coord_rejected") return 0.5; // rejected at step 1
    if (s === "approved") return 2;
    if (s === "rejected") return 1.5;
    return 0;
  };

  const activeStep = getStep(status);
  const isRejected = status === "coord_rejected" || status === "rejected";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((step, i) => {
        const done = i < activeStep;
        const active = Math.floor(activeStep) === i;
        const rejected = isRejected && Math.ceil(activeStep) === i;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: rejected ? "rgba(239,68,68,0.2)" : done ? "rgba(16,185,129,0.2)" : active ? "rgba(79,70,229,0.2)" : "var(--bg-elevated)",
                border: `2px solid ${rejected ? "var(--danger)" : done ? "var(--success)" : active ? "var(--primary)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, color: rejected ? "var(--danger)" : done ? "var(--success)" : active ? "var(--primary-light)" : "var(--text-muted)",
                fontWeight: 700, flexShrink: 0,
                transition: "all 0.3s ease",
              }}>
                {rejected ? "✕" : done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 9, color: active ? "var(--text-primary)" : "var(--text-muted)", whiteSpace: "nowrap", fontWeight: active ? 600 : 400 }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 28, height: 2, background: done ? "var(--success)" : "var(--border)", margin: "0 2px", marginBottom: 14, transition: "background 0.3s ease" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
