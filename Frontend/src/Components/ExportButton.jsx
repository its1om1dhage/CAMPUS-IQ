import * as XLSX from "xlsx";
import { Download } from "lucide-react";

export default function ExportButton({ data, filename = "campus_iq_export", label = "Export Excel", disabled }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // Flatten nested objects
    const flat = data.map(row => {
      const out = {};
      for (const [k, v] of Object.entries(row)) {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          out[k] = JSON.stringify(v);
        } else if (Array.isArray(v)) {
          out[k] = v.join(", ");
        } else {
          out[k] = v;
        }
      }
      return out;
    });

    const ws = XLSX.utils.json_to_sheet(flat);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Auto column width
    const cols = Object.keys(flat[0] || {}).map(k => ({ wch: Math.max(k.length, 16) }));
    ws["!cols"] = cols;

    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={handleExport}
      disabled={disabled || !data?.length}
      title="Export to Excel"
    >
      <Download size={13} />
      {label}
    </button>
  );
}
