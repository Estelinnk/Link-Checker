import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const checkUrl = async () => {
    const res = await fetch(`/api/check?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl mb-4">🔗 Link Checker</h1>
      <input
        className="border p-2 w-80"
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={checkUrl}
      >
        Vérifier
      </button>
      {result && (
        <div className="mt-4">
          {result.up ? (
            <p>✅ Le site est accessible (code {result.status})</p>
          ) : (
            <p>❌ Le site est inaccessible</p>
          )}
        </div>
      )}
    </main>
  );
}
