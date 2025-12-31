import { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Map from "./Map";
import {
  LayoutDashboard,
  Trash2,
  MapPin,
  BookOpen,
  Award,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    reward: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/ekowatch/backend/api/dashboard_stats.php")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Stat error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar close={() => setOpen(false)} />
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex h-full">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-72 shrink-0">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT (SCROLL DI SINI) */}
        <motion.main
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* HEADER */}
          <header className="sticky top-4 z-40 mx-4 mt-4 rounded-2xl bg-white/70 backdrop-blur-lg shadow-lg px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button className="md:hidden" onClick={() => setOpen(true)}>
                <Menu />
              </button>

              <div>
                <h2 className="text-xl font-extrabold text-green-800">
                  EcoWatch Dashboard
                </h2>
                <p className="text-sm text-gray-600">
                  Smart monitoring for cleaner cities 🌍
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-full shadow-lg font-semibold">
              ⭐ {user?.reward ?? 0} Points
            </div>
          </header>

          {/* HERO */}
          <section className="px-6 mt-10">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-green-900 mb-2">
                  Jaga Lingkungan, Mulai Dari Sekitar Kita 🌱
                </h1>
                <p className="text-gray-700 max-w-xl">
                  Laporkan titik sampah, pantau kebersihan, dan dapatkan reward
                  atas kontribusi nyatamu untuk lingkungan.
                </p>
              </div>

              <Link
                to="/lapor"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition font-semibold"
              >
                ➕ Lapor Sampah
              </Link>
            </div>
          </section>

          {/* STATS */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 mt-10">
            <Stat title="Total Laporan" value={stats.total} />
            <Stat title="Terverifikasi" value={stats.verified} />
            <Stat title="Pending" value={stats.pending} />
            <Stat title="Reward" value={stats.reward} />
          </section>

          {/* MAP PREVIEW */}
          <section className="px-6 mt-12 pb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-green-900">
                📍 Peta Lingkungan Sekitar
              </h3>

              <Link
                to="/map"
                className="text-sm font-semibold text-green-700 hover:underline"
              >
                Lihat Peta Lengkap →
              </Link>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40">
              <div className="pointer-events-none">
                <Map />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center">
                <Link
                  to="/map"
                  className="bg-white/90 backdrop-blur-lg px-6 py-3 rounded-xl font-bold text-green-700 shadow-lg hover:scale-105 transition"
                >
                  🗺️ Buka Peta Interaktif
                </Link>
              </div>
            </div>
          </section>

          {/* ARTICLE PREVIEW */}
          <section className="px-6 mt-16 pb-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-green-900">
                📚 Artikel Edukasi Terbaru
              </h3>

              <Link
                to="/artikel"
                className="text-sm font-semibold text-green-700 hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition cursor-pointer"
                >
                  <img
                    src={`https://source.unsplash.com/600x400/?environment,green,${i}`}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-5">
                    <span className="text-xs text-green-600 font-semibold">
                      Edukasi Lingkungan
                    </span>

                    <h4 className="font-bold text-green-900 mt-2 line-clamp-2">
                      Cara Sederhana Menjaga Lingkungan Sehari-hari
                    </h4>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      Langkah kecil yang bisa kamu lakukan untuk dampak besar
                      bagi bumi.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </motion.main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ================= */

function Sidebar({ close }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    await fetch("http://localhost/ekowatch/backend/api/logout.php", {
      method: "POST",
    });
  } catch (e) {
    console.warn("Logout API gagal, lanjut logout lokal");
  }

  logout();
  navigate("/login");
};


  return (
    <aside className="h-full bg-white/70 backdrop-blur-xl shadow-2xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-extrabold text-green-700">🌱 EcoWatch</h1>
        {close && (
          <button onClick={close}>
            <X />
          </button>
        )}
      </div>

      <nav className="space-y-3 flex-1 overflow-y-auto pr-2">
        <Nav
          icon={<LayoutDashboard />}
          label="Dashboard"
          to="/"
          onClick={close}
        />
        <Nav
          icon={<Trash2 />}
          label="Lapor Sampah"
          to="/lapor"
          onClick={close}
        />
        <Nav icon={<MapPin />} label="Peta Lokasi" to="/map" onClick={close} />
        <Nav
          icon={<BookOpen />}
          label="Artikel"
          to="/artikel"
          onClick={close}
        />
        <Nav icon={<Award />} label="Reward" to="/reward" onClick={close} />
      </nav>

      {/* USER INFO */}
      <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <User />
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm opacity-90">{user?.reward ?? 0} poin</p>
          </div>
        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="mt-4 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

/* ================= UI ================= */

function Nav({ icon, label, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl
                 text-green-900 hover:bg-green-100 transition font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:scale-105 transition">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-3xl font-extrabold text-green-800">{value}</p>
    </div>
  );
}
