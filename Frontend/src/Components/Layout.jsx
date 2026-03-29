import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

export default function Layout({ title, subtitle, children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <TopHeader title={title} subtitle={subtitle} />
        <main className="page-content animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
