import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  "Applied Science & Humanities",
  "Computer Science & Engineering",
  "CSE (AIML)",
  "Electronics & Telecommunication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Electronics & Computer Engineering",
  "Advanced Communication Technology",
  "AI & Data Science",
  "MBA",
];

export const DEPT_SHORT = {
  "Applied Science & Humanities": "ASH",
  "Computer Science & Engineering": "CSE",
  "CSE (AIML)": "AIML",
  "Electronics & Telecommunication": "EXTC",
  "Electrical Engineering": "EE",
  "Mechanical Engineering": "MECH",
  "Electronics & Computer Engineering": "ECE",
  "Advanced Communication Technology": "ACT",
  "AI & Data Science": "AIDS",
  "MBA": "MBA",
};

// ─── SUBMISSION TYPES ─────────────────────────────────────────────────────────
export const SUBMISSION_TYPES = [
  "Research Paper",
  "Conference Paper",
  "Journal Publication",
  "Patent",
  "Project",
  "Book Chapter",
  "Award",
  "Funded Project",
  "Consultancy",
  "Industrial Training",
];

// ─── ACADEMIC YEARS ───────────────────────────────────────────────────────────
export const ACADEMIC_YEARS = ["2022-23", "2023-24", "2024-25", "2025-26"];

// ─── STATUS TYPES ─────────────────────────────────────────────────────────────
export const STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  COORD_APPROVED: "coord_approved",
  COORD_REJECTED: "coord_rejected",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const MOCK_SUBMISSIONS = [
  {
    id: "sub-001",
    title: "AI-Based Traffic Control System Using Deep Learning",
    type: "Research Paper",
    status: "approved",
    submitted_by: { name: "Rahul Sharma", id: "STU2024001", role: "student" },
    contributors: ["Rahul Sharma", "Priya Mehta", "Dr. Anjali Singh"],
    department: "Computer Science & Engineering",
    year: "2024-25",
    submitted_at: "2026-03-15T10:30:00Z",
    coord_verified_by: "Prof. Amit Kulkarni",
    coord_verified_at: "2026-03-17T14:00:00Z",
    coord_remark: "Excellent work, well-documented.",
    rd_approved_by: "Dr. Rajesh Deshmukh",
    rd_approved_at: "2026-03-19T11:00:00Z",
    rd_remark: "Approved for college repository.",
  },
  {
    id: "sub-002",
    title: "Smart Irrigation System using IoT and ML",
    type: "Project",
    status: "coord_approved",
    submitted_by: { name: "Priya Mehta", id: "STU2024002", role: "student" },
    contributors: ["Priya Mehta", "Arjun Kapoor"],
    department: "Computer Science & Engineering",
    year: "2024-25",
    submitted_at: "2026-03-18T09:00:00Z",
    coord_verified_by: "Prof. Amit Kulkarni",
    coord_verified_at: "2026-03-20T10:00:00Z",
    coord_remark: "Verified. Good project.",
    rd_approved_by: null,
    rd_approved_at: null,
    rd_remark: null,
  },
  {
    id: "sub-003",
    title: "Blockchain-based Healthcare Data Security",
    type: "Journal Publication",
    status: "pending",
    submitted_by: { name: "Arjun Kapoor", id: "STU2024003", role: "student" },
    contributors: ["Arjun Kapoor", "Dr. Priya Patil"],
    department: "Computer Science & Engineering",
    year: "2024-25",
    submitted_at: "2026-03-20T11:30:00Z",
    coord_verified_by: null,
    coord_verified_at: null,
    coord_remark: null,
    rd_approved_by: null,
    rd_approved_at: null,
    rd_remark: null,
  },
  {
    id: "sub-004",
    title: "5G Network Slicing Techniques for Edge Computing",
    type: "Conference Paper",
    status: "coord_rejected",
    submitted_by: { name: "Dr. Priya Patil", id: "FAC2024010", role: "faculty" },
    contributors: ["Dr. Priya Patil", "Ms. Anjali Singh"],
    department: "Electronics & Telecommunication",
    year: "2024-25",
    submitted_at: "2026-03-10T08:00:00Z",
    coord_verified_by: "Prof. Ravi Kumar",
    coord_verified_at: "2026-03-12T09:00:00Z",
    coord_remark: "Missing proper citations. Please revise and resubmit.",
    rd_approved_by: null,
    rd_approved_at: null,
    rd_remark: null,
  },
  {
    id: "sub-005",
    title: "ML-Based Disease Prediction Using Patient Data",
    type: "Research Paper",
    status: "pending",
    submitted_by: { name: "Sneha Rao", id: "STU2024004", role: "student" },
    contributors: ["Sneha Rao", "Vikram Nair", "Dr. Meera Tiwari"],
    department: "AI & Data Science",
    year: "2024-25",
    submitted_at: "2026-03-22T14:00:00Z",
    coord_verified_by: null,
    coord_verified_at: null,
    coord_remark: null,
    rd_approved_by: null,
    rd_approved_at: null,
    rd_remark: null,
  },
  {
    id: "sub-006",
    title: "Electric Vehicle Battery Optimization Algorithm",
    type: "Patent",
    status: "approved",
    submitted_by: { name: "Prof. Girish Shah", id: "FAC2024020", role: "faculty" },
    contributors: ["Prof. Girish Shah", "Karan More"],
    department: "Electrical Engineering",
    year: "2024-25",
    submitted_at: "2026-02-28T10:00:00Z",
    coord_verified_by: "Dr. Mohan Rao",
    coord_verified_at: "2026-03-02T11:00:00Z",
    coord_remark: "Patent claim verified.",
    rd_approved_by: "Dr. Rajesh Deshmukh",
    rd_approved_at: "2026-03-05T09:00:00Z",
    rd_remark: "Approved. Patent filing in progress.",
  },
  {
    id: "sub-007",
    title: "Robotic Arm Control using Brain-Computer Interface",
    type: "Project",
    status: "pending",
    submitted_by: { name: "Ankit Joshi", id: "STU2024005", role: "student" },
    contributors: ["Ankit Joshi", "Riya Patel", "Prof. Sushma Pillai"],
    department: "Electronics & Computer Engineering",
    year: "2024-25",
    submitted_at: "2026-03-21T16:00:00Z",
    coord_verified_by: null,
    coord_verified_at: null,
    coord_remark: null,
    rd_approved_by: null,
    rd_approved_at: null,
    rd_remark: null,
  },
  {
    id: "sub-008",
    title: "Natural Language Processing for Marathi Text Classification",
    type: "Journal Publication",
    status: "coord_approved",
    submitted_by: { name: "Dr. Vandana Joshi", id: "FAC2024030", role: "faculty" },
    contributors: ["Dr. Vandana Joshi", "Rahul Sharma"],
    department: "CSE (AIML)",
    year: "2024-25",
    submitted_at: "2026-03-08T13:00:00Z",
    coord_verified_by: "Prof. Amit Kulkarni",
    coord_verified_at: "2026-03-10T14:00:00Z",
    coord_remark: "Well-researched paper.",
    rd_approved_by: null,
    rd_approved_at: null,
    rd_remark: null,
  },
  {
    id: "sub-009",
    title: "Sustainable Building Materials for Low-Cost Housing",
    type: "Funded Project",
    status: "approved",
    submitted_by: { name: "Dr. Ashok Nair", id: "FAC2024040", role: "faculty" },
    contributors: ["Dr. Ashok Nair", "Meera Pillai", "Sanjay Kumar"],
    department: "Mechanical Engineering",
    year: "2023-24",
    submitted_at: "2026-01-10T09:00:00Z",
    coord_verified_by: "Prof. Girish Shah",
    coord_verified_at: "2026-01-12T10:00:00Z",
    coord_remark: "Approved with recommendation.",
    rd_approved_by: "Dr. Rajesh Deshmukh",
    rd_approved_at: "2026-01-14T11:00:00Z",
    rd_remark: "Excellent funded project.",
  },
  {
    id: "sub-010",
    title: "Cybersecurity Framework for Industrial IoT Networks",
    type: "Conference Paper",
    status: "pending",
    submitted_by: { name: "Vikram Nair", id: "STU2024006", role: "student" },
    contributors: ["Vikram Nair", "Ankit Joshi"],
    department: "Computer Science & Engineering",
    year: "2024-25",
    submitted_at: "2026-03-23T10:00:00Z",
    coord_verified_by: null,
    coord_verified_at: null,
    coord_remark: null,
    rd_approved_by: null,
    rd_approved_at: null,
    rd_remark: null,
  },
];

export const MOCK_DEPT_STATS = [
  { dept: "CSE", short: "CSE", papers: 18, projects: 12, patents: 4, total: 34, approved: 28, pending: 6 },
  { dept: "AIML", short: "AIML", papers: 14, projects: 10, patents: 3, total: 27, approved: 22, pending: 5 },
  { dept: "EXTC", short: "EXTC", papers: 10, projects: 8, patents: 2, total: 20, approved: 15, pending: 5 },
  { dept: "EE", short: "EE", papers: 12, projects: 9, patents: 3, total: 24, approved: 20, pending: 4 },
  { dept: "MECH", short: "MECH", papers: 8, projects: 7, patents: 1, total: 16, approved: 12, pending: 4 },
  { dept: "ECE", short: "ECE", papers: 9, projects: 6, patents: 2, total: 17, approved: 13, pending: 4 },
  { dept: "AIDS", short: "AIDS", papers: 11, projects: 8, patents: 2, total: 21, approved: 16, pending: 5 },
  { dept: "MBA", short: "MBA", papers: 4, projects: 3, patents: 0, total: 7, approved: 5, pending: 2 },
];

export const MOCK_TRENDS = [
  { month: "Oct", submissions: 12 },
  { month: "Nov", submissions: 18 },
  { month: "Dec", submissions: 8 },
  { month: "Jan", submissions: 22 },
  { month: "Feb", submissions: 28 },
  { month: "Mar", submissions: 35 },
];

export const MOCK_USERS = [
  { id: "STU2024001", name: "Rahul Sharma", role: "student", department: "CSE", email: "rahul@college.edu", status: "active" },
  { id: "STU2024002", name: "Priya Mehta", role: "student", department: "CSE", email: "priya@college.edu", status: "active" },
  { id: "FAC2024010", name: "Dr. Priya Patil", role: "faculty", department: "EXTC", email: "priya.patil@college.edu", status: "active" },
  { id: "FAC2024015", name: "Prof. Amit Kulkarni", role: "branch_coordinator", department: "CSE", email: "amit@college.edu", status: "active" },
  { id: "HOD2024001", name: "Dr. Sunita More", role: "branch_hod", department: "CSE", email: "sunita@college.edu", status: "active" },
  { id: "RD2024001", name: "Dr. Rajesh Deshmukh", role: "rd_incharge", department: "All", email: "rajesh@college.edu", status: "active" },
];

// ─── SERVICE FUNCTIONS (Supabase or mock) ────────────────────────────────────

export async function getSubmissions(filters = {}) {
  if (supabase) {
    try {
      let query = supabase.from("submissions").select("*").order("submitted_at", { ascending: false });
      if (filters.department) query = query.eq("department", filters.department);
      if (filters.status) query = query.eq("status", filters.status);
      if (filters.year) query = query.eq("year", filters.year);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch { /* fallthrough to mock */ }
  }
  let data = [...MOCK_SUBMISSIONS];
  if (filters.department) data = data.filter(s => s.department === filters.department);
  if (filters.status) data = data.filter(s => s.status === filters.status);
  if (filters.year) data = data.filter(s => s.year === filters.year);
  return data;
}

export async function getMySubmissions(userId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("submitted_by_id", userId)
        .order("submitted_at", { ascending: false });
      if (!error) return data;
    } catch { /* fallthrough */ }
  }
  return MOCK_SUBMISSIONS.filter(s => s.submitted_by.id === userId || s.contributors.some(c => c.includes("Rahul")));
}

export async function getDepartmentStats() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("dept_stats").select("*");
      if (!error) return data;
    } catch { /* fallthrough */ }
  }
  return MOCK_DEPT_STATS;
}

export async function updateSubmissionStatus(id, status, remark, verifiedBy) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .update({ status, coord_remark: remark, coord_verified_by: verifiedBy })
        .eq("id", id);
      if (!error) return data;
    } catch { /* fallthrough */ }
  }
  // Mock: update in place
  const idx = MOCK_SUBMISSIONS.findIndex(s => s.id === id);
  if (idx !== -1) MOCK_SUBMISSIONS[idx] = { ...MOCK_SUBMISSIONS[idx], status, coord_remark: remark };
  return true;
}

export async function finalApproveSubmission(id, status, remark, approvedBy) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .update({ status, rd_remark: remark, rd_approved_by: approvedBy })
        .eq("id", id);
      if (!error) return data;
    } catch { /* fallthrough */ }
  }
  const idx = MOCK_SUBMISSIONS.findIndex(s => s.id === id);
  if (idx !== -1) MOCK_SUBMISSIONS[idx] = { ...MOCK_SUBMISSIONS[idx], status, rd_remark: remark };
  return true;
}
