import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "http://localhost/ekowatch/backend/api/register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // sukses daftar → ke login
      navigate("/login");
    } catch {
      setError("Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-200 to-emerald-300 flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[400px]"
      >
        <h1 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          🌱 Buat Akun EcoWatch
        </h1>

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Nama"
          className="w-full p-3 rounded-xl border mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl border mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl border mb-6 focus:ring-2 focus:ring-green-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition"
        >
          Daftar
        </button>

        <p className="text-center text-sm text-gray-600 mt-5">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Login di sini
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
