import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AppLayout from '../../components/AppLayout';
import DynamicForm from '../../components/DynamicForm';
import SubmissionPanel from '../../components/SubmissionPanel';
import { RD_TABLES } from '../../lib/tableConfig';
import { createRecord, getRecords } from '../../services/recordService';
import { approveSubmission, getSubmissions, rejectSubmission, submitRecord } from '../../services/submissionService';
import { addStudent, getAssignedStudents } from '../../services/userService';

export default function FacultyDashboard() {
  const [tableName, setTableName] = useState('projects');
  const [records, setRecords] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({
    full_name: '',
    email: '',
    password: 'Student@123',
    year: ''
  });

  const currentTable = useMemo(() => RD_TABLES[tableName], [tableName]);

  async function load() {
    try {
      const [recordRes, submissionRes, studentRes] = await Promise.all([
        getRecords(tableName),
        getSubmissions(),
        getAssignedStudents()
      ]);
      setRecords(recordRes.records || []);
      setSubmissions(submissionRes.submissions || []);
      setStudents(studentRes.users || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load faculty data');
    }
  }

  useEffect(() => {
    load();
  }, [tableName]);

  async function saveDraft(values) {
    const response = await createRecord(tableName, values);
    toast.success('Faculty draft created');
    const shouldSubmit = window.confirm('Submit this faculty record now?');
    if (shouldSubmit) {
      await submitRecord(tableName, { recordId: response.record.id, remarks: 'Faculty submission' });
      toast.success('Submitted');
    }
    await load();
  }

  async function createStudent(e) {
    e.preventDefault();
    try {
      await addStudent(studentForm);
      toast.success('Student added');
      setStudentForm({ full_name: '', email: '', password: 'Student@123', year: '' });
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add student');
    }
  }

  return (
    <AppLayout title="Faculty Interface">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 animate-slide-up">
          
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Add Student Panel */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Provision Student</h3>
              </div>
              <form onSubmit={createStudent} className="space-y-3">
                <input
                  placeholder="Full Legal Name"
                  value={studentForm.full_name}
                  onChange={(e) => setStudentForm((p) => ({ ...p, full_name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm"
                />
                <input
                  placeholder="University Email"
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm"
                />
                <div className="grid gap-3 grid-cols-2">
                  <input
                    placeholder="Year"
                    type="number"
                    value={studentForm.year}
                    onChange={(e) => setStudentForm((p) => ({ ...p, year: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm"
                  />
                  <input
                    placeholder="Password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-sm"
                  />
                </div>
                <button className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-slate-800 active:bg-slate-950">
                  Execute Provision
                </button>
              </form>
            </div>

            {/* Assigned Students Roster */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 flex flex-col h-full max-h-[280px]">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Student Roster</h3>
              </div>
              <div className="space-y-2 overflow-y-auto pr-2 special-scrollbar flex-1">
                {students.length ? students.map((student) => (
                  <div key={student.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex justify-between items-center hover:border-slate-300 transition-colors">
                    <div>
                      <p className="text-[13px] font-bold text-slate-900 leading-tight">{student.full_name}</p>
                      <p className="text-[10px] font-semibold tracking-wide text-slate-500 mt-0.5">{student.email}</p>
                    </div>
                    <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">Year {student.year || '-'}</span>
                  </div>
                )) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">No active assignments.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="mb-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Workflow Module</label>
              <p className="mt-1 text-sm font-semibold text-slate-900">Select the specific R&D reporting category to log faculty metrics.</p>
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
        </div>

        <div className="animate-fade-in [animation-delay:150ms] xl:sticky xl:top-24 xl:h-[calc(100vh-6rem)] xl:overflow-y-auto xl:pb-8 special-scrollbar">
          <SubmissionPanel
            title="Approvals Gateway"
            submissions={submissions}
            canReview
            onApprove={async (id, remarks) => { await approveSubmission(id, remarks); await load(); }}
            onReject={async (id, remarks) => { await rejectSubmission(id, remarks); await load(); }}
          />
        </div>
      </div>
    </AppLayout>
  );
}
