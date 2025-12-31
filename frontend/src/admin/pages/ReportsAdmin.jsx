export default function ReportsAdmin() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost/ekowatch/backend/admin/reports_list.php")
      .then(res => res.json())
      .then(setReports);
  }, []);

  const approve = (id) => {
    fetch("http://localhost/ekowatch/backend/admin/report_validate.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    }).then(() => {
      setReports(r =>
        r.map(x => x.id === id ? { ...x, status: "approved" } : x)
      );
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Laporan Masuk</h1>

      {reports.map(r => (
        <div key={r.id} className="bg-white p-4 rounded mb-3 shadow">
          <p className="font-semibold">{r.title}</p>
          <p className="text-sm">{r.description}</p>
          <p className="text-xs text-gray-500">
            Oleh: {r.name} | Status: {r.status}
          </p>

          {r.status === "pending" && (
            <button
              onClick={() => approve(r.id)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              Terima
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
