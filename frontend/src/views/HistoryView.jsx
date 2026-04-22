import { useState, useEffect } from 'react';
import { getDocuments } from '../api';

export default function HistoryView() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDocuments()
      .then(setDocs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-msg">Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  if (docs.length === 0) return <p className="status-msg">No documents yet.</p>;

  return (
    <div className="view history-view">
      <h2>History</h2>
      <ul className="doc-list">
        {docs.map((doc) => (
          <li key={doc.id} className="doc-item">
            <span className="doc-type">{doc.documentType || 'unknown'}</span>
            <span className={`doc-status status-${doc.status}`}>{doc.status}</span>
            <span className="doc-vendor">{doc.fields?.vendor || '—'}</span>
            <span className="doc-date">{doc.fields?.date || '—'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
