import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const PAGE_SIZE = 10;

// Skeleton row loader
function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-line" style={{ width: i === 0 ? "80%" : i === cols - 1 ? "60%" : "70%" }} />
        </td>
      ))}
    </tr>
  );
}

export default function DataTable({
  columns,   // [{ key, label, render?, sortable?, width? }]
  data,      // array of rows
  loading,
  emptyTitle = "No records found",
  emptySubtitle = "Try adjusting your filters.",
  keyField = "id",
  pageSize = PAGE_SIZE,
  onRowClick,
}) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // Sort
  let sorted = [...(data || [])];
  if (sortKey) {
    sorted.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ cursor: col.sortable ? "pointer" : "default", width: col.width, userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span style={{ fontSize: 10 }}>{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div style={{ textAlign: "center", padding: "48px 20px" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{emptyTitle}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{emptySubtitle}</div>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map(row => (
                <tr
                  key={row[keyField] || Math.random()}
                  onClick={() => onRowClick?.(row)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? <span style={{ color: "var(--text-muted)" }}>—</span>)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && sorted.length > pageSize && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 4px 4px", borderTop: "1px solid var(--border)", marginTop: 4 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { icon: ChevronsLeft, action: () => setPage(1), disabled: safePage === 1 },
              { icon: ChevronLeft, action: () => setPage(p => Math.max(1, p - 1)), disabled: safePage === 1 },
              { icon: ChevronRight, action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: safePage === totalPages },
              { icon: ChevronsRight, action: () => setPage(totalPages), disabled: safePage === totalPages },
            ].map(({ icon: Icon, action, disabled }, i) => (
              <button key={i} onClick={action} disabled={disabled} className="header-btn" style={{ opacity: disabled ? 0.4 : 1 }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
