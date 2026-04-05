import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function DynamicForm({ tableName, tableConfig, onSave }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [file, setFile] = useState(null);
  const [values, setValues] = useState({});

  const fields = useMemo(() => tableConfig?.fields || [], [tableConfig]);

  function updateValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    if (!title) {
      toast.error('Title is required');
      return;
    }

    const missingRequired = fields.find((field) => field.required && !values[field.name]);
    if (missingRequired) {
      toast.error(`${missingRequired.label} is required`);
      return;
    }

    await onSave({
      title,
      year,
      file,
      data: values
    });

    setTitle('');
    setValues({});
    setFile(null);
  }

  return (
    <form onSubmit={submit} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8 animate-slide-up">
      <div className="absolute top-0 left-0 h-1 w-full bg-slate-800" />
      
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">{tableConfig?.label || tableName}</h3>
        <p className="mt-1.5 text-xs font-semibold text-slate-500">Initialize a draft record prior to official workflow submission.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Record Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm"
            placeholder="Official Document Title"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Fiscal/Academic Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Digital Attachment</label>
          <div className="flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-[7px] hover:bg-slate-100 transition-all shadow-sm">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-200 file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
            />
          </div>
        </div>

        {fields.map((field) => (
          <div key={field.name} className={`space-y-1.5 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">{field.label}</label>

            {field.type === 'textarea' ? (
               <textarea
                value={values[field.name] || ''}
                onChange={(e) => updateValue(field.name, e.target.value)}
                className="min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm resize-y"
                placeholder={`Detailed ${field.label.toLowerCase()}`}
              />
            ) : field.type === 'select' ? (
              <select
                value={values[field.name] || ''}
                onChange={(e) => updateValue(field.name, e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm cursor-pointer"
              >
                <option value="" disabled>Select active option</option>
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={values[field.name] || ''}
                onChange={(e) => updateValue(field.name, e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm"
                placeholder={field.label}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:bg-slate-950"
        >
          <Save size={16} />
          Commit Local Draft
        </button>
      </div>
    </form>
  );
}
