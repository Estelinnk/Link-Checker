import { useEffect, useState } from 'react';

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatuses = async () => {
    const res = await fetch('/api/check');
    const data = await res.json();
    setServices(data.services);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 60000); // toutes les 60 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">📡 Link Checker Dashboard</h1>
      {loading ? (
        <p>Chargement des statuts...</p>
      ) : (
        <div className="grid gap-4">
          {services.map((service, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="text-sm text-gray-400 mb-2">{service.url}</p>
              {service.up ? (
                <span className="text-green-400 font-bold">✅ En ligne (code {service.status})</span>
              ) : (
                <span className="text-red-400 font-bold">❌ Hors ligne</span>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
