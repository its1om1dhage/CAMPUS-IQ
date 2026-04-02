import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { DEPARTMENTS, SUBMISSION_TYPES, ACADEMIC_YEARS } from "../services/supabase";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "coord_approved", label: "Coord. Approved" },
  { value: "coord_rejected", label: "Coord. Rejected" },
  { value: "approved", label: "R&D Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function FilterBar({
  search, onSearch,
  status, onStatus,
  department, onDepartment,
  year, onYear,
  type, onType,
  showDept = false,
  showType = false,
  showStatus = true,
  showYear = true,
  extra,
  onReset,
}) {
  const [expanded, setExpanded] = useState(false);
  const hasActiveFilters = status || department || year || type || search;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
      {/* Search + toggle row */}
      <div className="filter-bar" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        {onSearch !== undefined && (
          <div className="header-search" style={{ flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              placeholder="Search by title, contributor..."
              value={search || ""}
              onChange={e => onSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => onSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                <X size={13} />
              </button>
            )}
          </div>
        )}

        {/* Status filter inline */}
        {showStatus && onStatus && (
          <select
            className="form-select"
            value={status || ""}
            onChange={e => onStatus(e.target.value)}
            style={{ width: "auto", minWidth: 160, height: 36, padding: "0 12px" }}
          >
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        )}

        {/* Year filter */}
        {showYear && onYear && (
          <select
            className="form-select"
            value={year || ""}
            onChange={e => onYear(e.target.value)}
            style={{ width: "auto", minWidth: 120, height: 36, padding: "0 12px" }}
          >
            <option value="">All Years</option>
            {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}

        {/* More filters toggle */}
        {(showDept || showType) && (
          <button
            className={`btn btn-secondary btn-sm ${expanded ? "btn-accent" : ""}`}
            onClick={() => setExpanded(!expanded)}
            style={{ height: 36, gap: 6, flexShrink: 0 }}
          >
            <SlidersHorizontal size={13} />
            Filters {hasActiveFilters && <span style={{ background: "var(--primary)", color: "white", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>•</span>}
          </button>
        )}

        {/* Reset */}
        {hasActiveFilters && onReset && (
          <button className="btn btn-danger btn-sm" onClick={onReset} style={{ height: 36 }}>
            <X size={13} /> Reset
          </button>
        )}

        {extra}
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "14px 16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          {showDept && onDepartment && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="form-label" style={{ marginBottom: 6 }}>Department</label>
              <select className="form-select" value={department || ""} onChange={e => onDepartment(e.target.value)}>
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
          {showType && onType && (
            <div style={{ flex: 1, minWidth: 180 }}>
              <label className="form-label" style={{ marginBottom: 6 }}>Type</label>
              <select className="form-select" value={type || ""} onChange={e => onType(e.target.value)}>
                <option value="">All Types</option>
                {SUBMISSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
