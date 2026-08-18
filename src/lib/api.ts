const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  // 204 No Content responses (DELETE endpoints) have no body to parse.
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

// Separate from the `api` object above: it sends FormData, not JSON, so it
// can't set a 'Content-Type: application/json' header or JSON.stringify the
// body the way request() does - the browser needs to set its own
// multipart/form-data boundary header instead.
export async function uploadImage(file: File): Promise<{ url: string }> {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE}/api/admin/upload`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
