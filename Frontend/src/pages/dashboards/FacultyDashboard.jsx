import Layout from "../../Components/Layout";
import { StatCard, StatCardGrid } from "../../Components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FlaskConical, Award, BookOpen, Users, Upload, FileText } from "lucide-react";

const rdData = [
  { month: "Oct", papers: 1, projects: 2, patents: 0 },
  { month: "Nov", papers: 2, projects: 1, patents: 1 },
  { month: "Dec", papers: 1, projects: 3, patents: 0 },
  { month: "Jan", papers: 3, projects: 2, patents: 1 },
  { month: "Feb", papers: 2, projects: 4, patents: 0 },
  { month: "Mar", papers: 4, projects: 3, patents: 2 },
];

const typeData = [
  { name: "Research Papers", value: 8, color: "#4f46e5" },
  { name: "Projects", value: 5, color: "#06b6d4" },
  { name: "Patents", value: 2, color: "#10b981" },
  { name: "Workshops", value: 3, color: "#f59e0b" },
];

const submissions = [
  { student: "Rahul Sharma", title: "AI Traffic Control", type: "Project", status: "Pending Review" },
  { student: "Priya Singh", title: "IoT Smart Classroom", type: "Paper", status: "Approved" },
  { student: "Arjun Mehta", title: "Blockchain Supply Chain", type: "Paper", status: "Submitted" },
  { student: "Neha Patil", title: "Deep Learning in Medical Imaging", type: "Project", status: "Draft" },
];

export default function FacultyDashboard() {
  return (
    <Layout title="Faculty Dashboard" subtitle="CAMPUS-IQ · R&D Module · AY 2025–26">
      <StatCardGrid>
        <StatCard label="Total R&D Work" value="18" icon={FlaskConical} color="blue" trend={3.2} />
        <StatCard label="Publications" value="8" icon={BookOpen} color="green" trend={2} />
        <StatCard label="Patents Filed" value="2" icon={Award} color="orange" />
        <StatCard label="Guided Students" value="12" icon={Users} color="purple" trend={1} />
      </StatCardGrid>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">R&D Output Trend</div>
              <div className="card-subtitle">Papers, Projects, Patents per month</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rdData}>
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
              <Bar dataKey="papers" fill="var(--primary)" radius={[3,3,0,0]} stackId="a" name="Papers" />
              <Bar dataKey="projects" fill="var(--accent)" radius={[3,3,0,0]} stackId="a" name="Projects" />
              <Bar dataKey="patents" fill="var(--success)" radius={[3,3,0,0]} stackId="a" name="Patents" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">R&D Breakdown</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {typeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-primary)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Submissions */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Student Submissions Under Me</div>
            <div className="card-subtitle">Students guided by you — current AY</div>
          </div>
          <button className="btn btn-primary btn-sm"><Upload size={13} /> Add My Work</button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Student</th><th>Title</th><th>Type</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{s.student}</td>
                <td className="td-muted" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</td>
                <td><span className="badge info">{s.type}</span></td>
                <td><span className={`badge ${s.status === "Approved" ? "success" : s.status === "Submitted" || s.status === "Pending Review" ? "warning" : "muted"}`}>{s.status}</span></td>
                <td><button className="btn btn-secondary btn-sm"><FileText size={12} /> Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
