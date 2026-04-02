import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

export default function Layout({ title, subtitle, children, pendingCount, onRefresh }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar />
      <div className="main-area">
        <TopHeader 
          title={title} 
          subtitle={subtitle} 
          pendingCount={pendingCount} 
          onRefresh={onRefresh} 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />
        <main className="page-content animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
