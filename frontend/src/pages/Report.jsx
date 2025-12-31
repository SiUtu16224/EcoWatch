import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from "react-leaflet";
import {
  Camera,
  MapPin,
  Send,
  Loader2,
  Award
} from "lucide-react";
import "leaflet/dist/leaflet.css";

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });

  return position ? <Marker position={position} /> : null;
}

export default function Report() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 📍 GPS
  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => alert("Gagal mendapatkan lokasi")
    );
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
  e.preventDefault();

  if (!position) {
    alert("Silakan tentukan lokasi laporan");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", desc);
  formData.append("latitude", position.lat);
  formData.append("longitude", position.lng);
  formData.append("photo", photo);

  fetch("http://localhost/ekowatch/backend/api/reports.php", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setSuccess(true);
        setTitle("");
        setDesc("");
        setPhoto(null);
        setPreview(null);
        setPosition(null);
      } else {
        alert("Gagal menyimpan laporan");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Terjadi kesalahan server");
    })
    .finally(() => {
      setLoading(false);
    });
}


  return (
    <motion.div
    
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 p-6"
    >
        {/*KEMBALI*/}
        <Link
            to="/"
            className="fixed top-6 left-6 z-50 flex items-center gap-2
            bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg
            text-green-800 font-semibold hover:scale-105 transition"
        >
            <ArrowLeft size={18} />
        Kembali
        </Link>

      {/* HERO */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-green-900 mb-3">
          🚮 Laporkan Sampah, Selamatkan Lingkungan
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Setiap laporan bernilai. Dapatkan poin & bantu kota jadi lebih bersih.
        </p>
      </div>

      {/* CARD */}
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 grid md:grid-cols-2 gap-8">

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="font-semibold">Judul Laporan</label>
            <input
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-400"
              placeholder="Sampah menumpuk di selokan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-semibold">Deskripsi</label>
            <textarea
              rows="4"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-400"
              placeholder="Jelaskan kondisi lingkungan..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-semibold flex items-center gap-2">
              <Camera size={18} /> Foto Sampah
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              required
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 rounded-xl shadow-lg max-h-48 object-cover"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={getLocation}
              className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold"
            >
              <MapPin size={18} /> Gunakan Lokasi Saya
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award size={16} /> +20 poin
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Mengirim...
              </>
            ) : (
              <>
                <Send /> Kirim Laporan
              </>
            )}
          </button>

          {success && (
            <p className="text-green-700 font-semibold text-center">
              ✅ Laporan terkirim! +20 poin
            </p>
          )}
        </form>

        {/* MAP */}
        <div>
          <p className="font-semibold mb-2">📍 Tentukan Lokasi</p>
          <MapContainer
            center={position || [-6.2, 106.8]}
            zoom={13}
            className="h-[420px] rounded-2xl shadow-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker
              position={position}
              setPosition={setPosition}
            />
          </MapContainer>

          {position && (
            <p className="text-sm mt-2 text-gray-600">
              Koordinat: {position.lat.toFixed(5)},{" "}
              {position.lng.toFixed(5)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
