import { useState } from 'react';
import { uploadDocument } from '../api';

export default function UploadView({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }

  async function handleUpload() {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    try {
      const doc = await uploadDocument(file);
      onSuccess(doc);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="view upload-view">
      <label className="file-input-label">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          disabled={loading}
        />
        {preview ? 'Change photo' : 'Take or select a photo'}
      </label>

      {preview && (
        <img src={preview} alt="Preview" className="preview-image" />
      )}

      {error && <p className="error">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="primary-btn"
      >
        {loading ? 'Processing…' : 'Scan document'}
      </button>
    </div>
  );
}
