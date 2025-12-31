import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bookmark, BookmarkCheck, Clock, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const API_URL = "http://localhost/ekowatch/backend/api/articles.php";

export default function Articles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [activeCat, setActiveCat] = useState("Semua");
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= BOOKMARK ================= */
  useEffect(() => {
    setBookmarks(JSON.parse(localStorage.getItem("bookmarks")) || []);
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}?search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search]);

  /* ================= CATEGORY GENERATOR ================= */
  const categories = useMemo(() => {
    const map = {};
    articles.forEach((a) => {
      map[a.category] = (map[a.category] || 0) + 1;
    });

    return [
      { name: "Semua", total: articles.length },
      ...Object.keys(map).map((c) => ({
        name: c,
        total: map[c],
      })),
    ];
  }, [articles]);

  /* ================= FILTERED ================= */
  const filtered = useMemo(() => {
    if (activeCat === "Semua") return articles;
    return articles.filter((a) => a.category === activeCat);
  }, [articles, activeCat]);

  /* ================= BOOKMARK ================= */
  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((x) => x !== id)
      : [...bookmarks, id];

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="
    fixed top-6 left-6 z-50
    flex items-center gap-2
    px-4 py-2
    rounded-full
    bg-gradient-to-r from-green-600 to-emerald-500
    text-white font-semibold
    shadow-lg
    hover:scale-105 hover:shadow-xl
    transition
  "
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="ml-20 text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            🌱 EcoWatch Insight
          </h1>

          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel lingkungan..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_280px] gap-12">
        {/* CONTENT */}
        <section>
          {loading ? (
            <p className="text-gray-500">Memuat artikel...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Leaf className="mx-auto mb-4 text-green-500" size={48} />
              <p className="font-semibold text-green-700">
                Artikel tidak ditemukan 🌱
              </p>
            </div>
          ) : (
            <>
              {/* FEATURED */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-14 cursor-pointer"
                  onClick={() => navigate(`/artikel/${featured.id}`)}
                >
                  <div className="relative">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-[380px] object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent rounded-2xl" />
                  </div>

                  <span className="inline-block mt-4 text-sm font-semibold text-green-600">
                    {featured.category}
                  </span>

                  <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">
                    {featured.title}
                  </h2>

                  <p className="text-gray-600 text-lg max-w-3xl">
                    {featured.description}
                  </p>
                </motion.div>
              )}

              {/* LIST */}
              <div className="space-y-10">
                {rest.map((a) => (
                  <motion.article
                    key={a.id}
                    whileHover={{ y: -4 }}
                    className="flex gap-6 cursor-pointer group"
                    onClick={() => navigate(`/artikel/${a.id}`)}
                  >
                    <img
                      src={a.image}
                      alt={a.title}
                      className="w-56 h-36 object-cover rounded-xl flex-shrink-0"
                    />

                    <div className="flex-1">
                      <span className="text-xs text-green-600 font-semibold">
                        {a.category}
                      </span>

                      <h3 className="text-xl font-bold text-gray-900 group-hover:underline mt-1">
                        {a.title}
                      </h3>

                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {a.description}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={14} /> {a.read_time}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(a.id);
                          }}
                          className="text-gray-500 hover:text-green-600"
                        >
                          {bookmarks.includes(a.id) ? (
                            <BookmarkCheck />
                          ) : (
                            <Bookmark />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 sticky top-28">
            <h3 className="font-bold text-gray-900 mb-4">Kategori</h3>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.name}>
                  <button
                    onClick={() => setActiveCat(c.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                      ${
                        activeCat === c.name
                          ? "bg-green-100 text-green-700 font-semibold"
                          : "hover:bg-green-50"
                      }`}
                  >
                    {c.name} ({c.total})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
