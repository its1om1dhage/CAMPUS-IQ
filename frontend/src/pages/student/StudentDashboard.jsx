import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AppLayout from '../../components/AppLayout';
import DynamicForm from '../../components/DynamicForm';
import SubmissionPanel from '../../components/SubmissionPanel';
import { RD_TABLES } from '../../lib/tableConfig';
import { createRecord, getRecords } from '../../services/recordService';
import { getSubmissions, submitRecord } from '../../services/submissionService';

export default function StudentDashboard() {
  const [tableName, setTableName] = useState('publications');
  const [records, setRecords] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const currentTable = useMemo(() => RD_TABLES[tableName], [tableName]);

  async function load() {
    try {
      const [recordRes, submissionRes] = await Promise.all([
        getRecords(tableName),
        getSubmissions()
      ]);
      setRecords(recordRes.records || []);
      setSubmissions(submissionRes.submissions || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load student data');
    }
  }

  useEffect(() => {
    load();
  }, [tableName]);

  async function saveDraft(values) {
    const response = await createRecord(tableName, values);
    toast.success('Draft created');
    const shouldSubmit = window.confirm('Do you want to submit this record now?');
    if (shouldSubmit) {
      await submitRecord(tableName, { recordId: response.record.id, remarks: 'Submitted from student dashboard' });
      toast.success('Record submitted');
    }
    await load();
  }

  return (
    <AppLayout title="Student Interface">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 animate-slide-up">
          {/* Module Selector */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="mb-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Workflow Module</label>
              <p className="mt-1 text-sm font-semibold text-slate-900">Select the specific R&D reporting category.</p>
            </div>
            <div className="relative">
              <select
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 pr-10 text-sm font-bold text-slate-900 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 hover:border-slate-400 cursor-pointer shadow-sm"
              >
                {Object.entries(RD_TABLES).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
              </div>
            </div>
          </div>

          <DynamicForm tableName={tableName} tableConfig={currentTable} onSave={saveDraft} />

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Local Drafts</h3>
                <p className="text-xs font-semibold text-slate-500">Awaiting official submission</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {records.length ? records.map((record) => (
                <div key={record.id} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{record.title}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <span className="rounded-md bg-white px-2 py-0.5 border border-slate-200">Year {record.year || '-'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="uppercase tracking-widest text-slate-600">{record.status}</span>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
                  <div className="mb-3 rounded-full bg-slate-200/50 p-3 text-slate-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-900">No active drafts found.</p>
                  <p className="text-xs font-medium text-slate-500 mt-1 max-w-[200px]">Save a record in the form to begin tracking your local drafts.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:150ms] xl:sticky xl:top-24 xl:h-[calc(100vh-6rem)] xl:overflow-y-auto xl:pb-8 special-scrollbar">
          <SubmissionPanel title="Submission Status Portal" submissions={submissions} />
        </div>
      </div>
    </AppLayout>
  );
}
