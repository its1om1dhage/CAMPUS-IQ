import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  BRANCH_COORDINATOR: "branch_coordinator",
  BRANCH_HOD: "branch_hod",
  RD_INCHARGE: "rd_incharge",
  DEAN_PD: "dean_pd",
  IQAC_INCHARGE: "iqac_incharge",
  PRINCIPAL: "principal",
  COLLEGE_MANAGEMENT: "college_management",
  SUPER_ADMIN: "super_admin",
};

export const ROLE_CONFIG = {
  [ROLES.STUDENT]: {
    label: "Student",
    icon: "🎓",
    color: "blue",
    branch: "Computer Engineering",
    name: "Rahul Sharma",
    id: "STU2024001",
  },
  [ROLES.FACULTY]: {
    label: "Faculty",
    icon: "👨‍🏫",
    color: "green",
    branch: "Computer Engineering",
    name: "Dr. Priya Patil",
    id: "FAC2024010",
  },
  [ROLES.BRANCH_COORDINATOR]: {
    label: "Branch Coordinator",
    icon: "🗂️",
    color: "purple",
    branch: "Computer Engineering",
    name: "Prof. Amit Kulkarni",
    id: "FAC2024015",
  },
  [ROLES.BRANCH_HOD]: {
    label: "Branch HOD",
    icon: "🏛️",
    color: "orange",
    branch: "Computer Engineering",
    name: "Dr. Sunita More",
    id: "HOD2024001",
  },
  [ROLES.RD_INCHARGE]: {
    label: "R&D Incharge",
    icon: "🔬",
    color: "cyan",
    branch: "All Branches",
    name: "Dr. Rajesh Deshmukh",
    id: "RD2024001",
  },
  [ROLES.DEAN_PD]: {
    label: "Dean P&D",
    icon: "📊",
    color: "blue",
    branch: "All Departments",
    name: "Dr. Vandana Joshi",
    id: "DEAN2024001",
  },
  [ROLES.IQAC_INCHARGE]: {
    label: "IQAC Incharge",
    icon: "✅",
    color: "green",
    branch: "All Departments",
    name: "Dr. Meera Tiwari",
    id: "IQAC2024001",
  },
  [ROLES.PRINCIPAL]: {
    label: "Principal",
    icon: "🎓",
    color: "red",
    branch: "Entire College",
    name: "Dr. Ashok Nair",
    id: "PRIN2024001",
  },
  [ROLES.COLLEGE_MANAGEMENT]: {
    label: "College Management",
    icon: "🏫",
    color: "purple",
    branch: "Entire Institution",
    name: "Mr. Suresh Mehta",
    id: "MGT2024001",
  },
  [ROLES.SUPER_ADMIN]: {
    label: "Super Admin",
    icon: "⚡",
    color: "red",
    branch: "System Wide",
    name: "System Administrator",
    id: "SA0000001",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("campus_iq_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((role) => {
    const config = ROLE_CONFIG[role];
    const userData = { role, ...config };
    localStorage.setItem("campus_iq_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("campus_iq_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
