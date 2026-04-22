const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function uploadDocument(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${BASE_URL}/documents`, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed.');
  return data;
}

export async function getDocuments() {
  const res = await fetch(`${BASE_URL}/documents`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load history.');
  return data;
}
