import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===============================
   CUSTOM MARKER
================================ */
const markerByStatus = (status) =>
  L.divIcon({
    html: `
      <div class="
        w-10 h-10 rounded-full flex items-center justify-center
        text-white font-bold shadow-xl animate-pulse
        ${status === "baru" ? "bg-green-500" :
          status === "proses" ? "bg-yellow-500" :
          "bg-red-500"}
      ">
        🗑️
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

/* ===============================
   AUTO FLY MAP
================================ */
function FlyTo({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, { duration: 1.2 });
    }
  }, [position]);

  return null;
}

/* ===============================
   MAIN COMPONENT
================================ */
export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [focus, setFocus] = useState(null);

  useEffect(() => {
    fetch("http://localhost/ekowatch/backend/api/reports.php")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch(console.error);
  }, []);

  return (
    <div className="relative h-screen w-full">

      {/* MAP */}
      <MapContainer
        center={[-6.2, 106.8]}
        zoom={13}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        

        {/* MARKERS */}
        {reports.map((r) => (
          <Marker
            key={r.id}
            position={[r.latitude, r.longitude]}
            icon={markerByStatus(r.status)}
            eventHandlers={{
              click: () =>
                setFocus([r.latitude, r.longitude])
            }}
          >
            <Popup>
              <div className="w-56">
                <img
                  src={`http://localhost/ekowatch/backend/upload/${r.photo}`}
                  className="rounded-lg mb-2"
                />
                <h3 className="font-bold">{r.title}</h3>

                <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full
                  bg-green-100 text-green-700">
                  {r.status}
                </span>

                <p className="text-xs text-gray-500 mt-2">
                  {r.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        <FlyTo position={focus} />
      </MapContainer>

      {/* HEADER */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50
        bg-white/70 backdrop-blur-xl rounded-full shadow-xl
        px-6 py-3 flex items-center gap-4">
        <h1 className="font-bold text-green-800">
          🗺️ Peta Laporan Sampah
        </h1>
        <Link
          to="/lapor"
          className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold"
        >
          + Lapor
        </Link>
      </div>

      {/* STATS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50
        bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl
        px-8 py-4 flex gap-8">

        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-2xl font-bold text-green-700">
            {reports.length}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Baru</p>
          <p className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === "baru").length}
          </p>
        </div>
      </div>

      {/* BACK */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50
        bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow
        font-semibold text-green-700"
      >
        ⬅ Dashboard
      </Link>
    </div>
  );
}
