export default function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to Dashboard
        </h1>
        <p className="text-gray-700">
          Your role: <span className="font-semibold">{role}</span>
        </p>
      </div>
    </div>
  );
}
