import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { Trophy, Gift, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Reward() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetch("http://localhost/ekowatch/backend/api/leaderboard.php")
      .then((res) => res.json())
      .then(setLeaderboard);

    fetch("http://localhost/ekowatch/backend/api/rewards.php")
      .then((res) => res.json())
      .then(setRewards);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 p-6">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col gap-4">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-green-800 flex items-center gap-2">
            🎁 Reward & Peringkat
          </h1>

          {/* TOMBOL KEMBALI */}
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-xl
                 text-green-700 font-semibold shadow hover:bg-green-50 transition"
          >
            <ArrowLeft size={18} />
            Dashboard
          </motion.button>
        </div>

        {/* USER POINT */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-lg">
          <p className="text-sm text-gray-600">Poin kamu</p>
          <p className="text-3xl font-extrabold text-green-700">
            ⭐ {user?.reward ?? 0} poin
          </p>

          {/* PROGRESS */}
          <div className="mt-3 h-3 bg-green-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((user.reward / 500) * 100, 100)}%`,
              }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-600"
            />
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Kumpulkan poin untuk membuka hadiah 🎉
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEADERBOARD */}
        {/* LEADERBOARD */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 flex flex-col">
          <h2 className="flex items-center gap-2 text-xl font-bold text-green-800 mb-4">
            <Trophy /> Leaderboard
          </h2>

          <ul className=" space-y-3 overflow-y-auto pr-2 max-h-[520px] scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 ">
            {leaderboard.map((u, i) => (
              <motion.li
                key={u.id}
                whileHover={{ scale: 1.02 }}
                className={`flex justify-between items-center p-4 rounded-xl transition
    ${
      u.id === user?.id
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg ring-2 ring-emerald-400"
        : "bg-white hover:bg-green-50"
    } `}
              >
                <span
                  className={`font-semibold ${
                    u.id === user?.id ? "text-white" : "text-green-900"
                  }`}
                >
                  #{i + 1} {u.name}
                  {u.id === user?.id && " 👑"}
                </span>

                <span
                  className={`font-bold ${
                    u.id === user?.id ? "text-white" : "text-green-700"
                  }`}
                >
                  {u.reward} pts
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* REWARD SHOP */}
        <div className="lg:col-span-2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-green-800 mb-4">
            <Gift /> Tukar Hadiah
          </h2>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {rewards.map((r) => {
              const unlocked = user.reward >= r.points_required;

              return (
                <motion.div
                  key={r.id}
                  whileHover={{ y: -6 }}
                  className={`relative rounded-3xl overflow-hidden shadow-xl
                  ${unlocked ? "bg-white" : "bg-gray-100 opacity-80"}`}
                >
                  {/* IMAGE */}
                  <div className="h-40 bg-gray-200 overflow-hidden">
                    <img
                      src={`http://localhost/ekowatch/backend/upload/rewards/${r.image}`}
                      alt={r.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <h3 className="font-bold text-green-900">{r.title}</h3>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {r.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="font-semibold text-green-700">
                        {r.points_required} poin
                      </span>

                      {unlocked ? (
                        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition">
                          Tukar
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Lock size={16} />
                          Terkunci
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BADGE */}
                  {unlocked && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} /> Ready
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
