import { useEffect, useState } from 'react';

const getMockHistory = () => {
  const history = [];
  const now = new Date();
  for (let i = 0; i < 90; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const isUp = Math.random() > 0.1; // 90% chance UP
    const duration = Math.floor(Math.random() * 60) + 1;
    history.push({
      date: date.toISOString().split('T')[0],
      status: isUp ? 'up' : 'down',
      duration: isUp ? null : duration
    });
  }
  return history.reverse();
};

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatuses = async () => {
    const res = await fetch('/api/check');
    const data = await res.json();

    const enhancedServices = data.services.map((s) => ({
      ...s,
      history: getMockHistory()
    }));

    setServices(enhancedServices);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 60000); // update every 60s
    return () => clearInterval(interval);
  }, []);

  const allServicesUp = services.every(s => s.up);

  return (
    <main className="min-h-screen bg-[#0d0d14] text-white p-10 font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Soday-host</h1>
        <nav className="mt-2 text-sm text-gray-400 space-x-4">
          <span className="font-semibold text-white">Status</span>
          <span>Maintenance</span>
          <span>Previous incidents</span>
        </nav>
      </header>
      
      <section className="text-center mb-10">
        <div className="text-red-500 text-3xl">❗</div>
        <h2 className="text-2xl font-bold">
          {allServicesUp ? 'All systems operational' : 'Some services are down'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">Last updated just now</p>
      </section>

      <section className="bg-[#1a1a2e] rounded-lg p-6 max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Web</h3>
        <div className="space-y-6">
          {services.map((s, i) => (
            <div key={i} className="bg-[#12121c] rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-lg font-medium">
                    {s.up ? '🟢' : '🔴'} {s.name}
                  </p>
                  <p className="text-sm text-gray-400">{s.url}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{s.up ? 'Operational' : 'Down'}</p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                {s.history.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-6 rounded-sm ${entry.status === 'up' ? 'bg-green-500' : 'bg-red-500'} cursor-default`}
                    title={
                      entry.status === 'down'
                        ? `⛔ ${entry.date} - Down for ${entry.duration} min`
                        : ''
                    }
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 text-center text-xs text-gray-600">
        Powered by ⚡ Link Checker
      </footer>
    </main>
  );
}
