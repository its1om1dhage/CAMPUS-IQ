import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import { FlaskConical, Users, CheckSquare, ChevronRight, ChevronLeft, Plus, X, Upload } from "lucide-react";
import { SUBMISSION_TYPES, ACADEMIC_YEARS, DEPARTMENTS } from "../services/supabase";
import { useAuth } from "../context/AuthContext";

const STEPS = [
  { key: "basic", label: "Basic Info", icon: FlaskConical },
  { key: "contributors", label: "Contributors", icon: Users },
  { key: "review", label: "Review & Submit", icon: CheckSquare },
];

export default function SubmitForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "Research Paper",
    year: "2024-25",
    department: user?.branch || "Computer Science & Engineering",
    description: "",
    journal: "",
    doi: "",
    contributors: [],
    newContrib: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addContrib = () => {
    if (!form.newContrib.trim()) return;
    set("contributors", [...form.contributors, form.newContrib.trim()]);
    set("newContrib", "");
  };

  const removeContrib = (i) => set("contributors", form.contributors.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    // Mock submission
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout title="New Submission" subtitle="CAMPUS-IQ · R&D Module">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <div style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Submission Received!</div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 420, marginBottom: 28 }}>
            Your R&D submission "<strong>{form.title}</strong>" has been submitted and is now pending coordinator verification.
          </div>
          <div className="alert-banner success" style={{ maxWidth: 420, marginBottom: 24 }}>
            <CheckSquare size={16} />
            <div><strong>Status:</strong> Pending Review · You'll be notified on approval.</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setStep(0); setForm({ ...form, title: "", description: "" }); }}>Submit Another</button>
            <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="New R&D Submission" subtitle="CAMPUS-IQ · Submit Research, Patent, Project or Publication">
      {/* Step Indicator */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.key} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: done ? "var(--success)" : active ? "var(--primary)" : "var(--bg-elevated)",
                    border: `2px solid ${done ? "var(--success)" : active ? "var(--primary)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}>
                    {done ? <CheckSquare size={20} style={{ color: "white" }} /> : <Icon size={18} style={{ color: active ? "white" : "var(--text-muted)" }} />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 80, height: 2, background: done ? "var(--success)" : "var(--border)", margin: "0 8px", marginBottom: 22, transition: "background 0.3s" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="animate-in">
            <div className="card-header" style={{ marginBottom: 24 }}>
              <div><div className="card-title">Basic Information</div><div className="card-subtitle">Provide details about your R&D work</div></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" placeholder="Full title of your work" value={form.title} onChange={e => set("title", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
                    {SUBMISSION_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year *</label>
                  <select className="form-select" value={form.year} onChange={e => set("year", e.target.value)}>
                    {ACADEMIC_YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-select" value={form.department} onChange={e => set("department", e.target.value)}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              {(form.type === "Journal Publication" || form.type === "Conference Paper" || form.type === "Research Paper") && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Journal / Conference Name</label>
                    <input className="form-input" placeholder="e.g. IEEE Transactions on..." value={form.journal} onChange={e => set("journal", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">DOI / Link (optional)</label>
                    <input className="form-input" placeholder="https://doi.org/..." value={form.doi} onChange={e => set("doi", e.target.value)} />
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" style={{ minHeight: 110 }} placeholder="Brief abstract or description of the work..." value={form.description} onChange={e => set("description", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contributors */}
        {step === 1 && (
          <div className="animate-in">
            <div className="card-header" style={{ marginBottom: 24 }}>
              <div><div className="card-title">Contributors</div><div className="card-subtitle">Add all authors and collaborators</div></div>
            </div>

            {/* Primary (auto) */}
            <div style={{ padding: "12px 16px", background: "var(--primary-glow)", border: "1px solid var(--border-accent)", borderRadius: "var(--radius-md)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>
                {user?.name?.[0] || "?"}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{user?.name || "You"}</div>
                <div style={{ fontSize: 11, color: "var(--text-accent)" }}>Primary Contributor (auto-added)</div>
              </div>
            </div>

            <div className="alert-banner info" style={{ marginBottom: 20 }}>
              <div>If a contributor is from another department or external, type their full name. Registered users will receive automatic notifications.</div>
            </div>

            {form.contributors.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", marginBottom: 8, border: "1px solid var(--border)" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "var(--text-muted)" }}>
                  {c[0]?.toUpperCase()}
                </div>
                <span style={{ flex: 1, fontWeight: 500 }}>{c}</span>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => removeContrib(i)}><X size={14} /></button>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <input
                className="form-input"
                placeholder="Contributor name or ID..."
                value={form.newContrib}
                onChange={e => set("newContrib", e.target.value)}
                onKeyDown={e => e.key === "Enter" && addContrib()}
              />
              <button className="btn btn-primary btn-sm" onClick={addContrib} style={{ flexShrink: 0 }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <div className="animate-in">
            <div className="card-header" style={{ marginBottom: 24 }}>
              <div><div className="card-title">Review & Submit</div><div className="card-subtitle">Confirm all details before submitting</div></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "Title", value: form.title },
                { label: "Type", value: form.type },
                { label: "Academic Year", value: form.year },
                { label: "Department", value: form.department },
                { label: "Journal/Conference", value: form.journal || "—" },
                { label: "Contributors", value: [user?.name, ...form.contributors].join(", ") },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ width: 180, fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", flexShrink: 0 }}>{item.label}</span>
                  <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
              <div style={{ padding: "12px 0" }}>
                <span style={{ width: 180, fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Description</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{form.description}</span>
              </div>
            </div>

            <div className="alert-banner info" style={{ marginTop: 20 }}>
              <Upload size={15} />
              <div>After submission, your coordinator will review this entry. You will be notified about the status.</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          {step > 0 ? (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
              <ChevronLeft size={15} /> Back
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              disabled={step === 0 && (!form.title || !form.description)}
              onClick={() => setStep(s => s + 1)}
            >
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.title || !form.description}>
              <Upload size={15} /> Submit for Review
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
