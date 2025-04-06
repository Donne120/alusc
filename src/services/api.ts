const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function sendQuery(query: string, role: string = 'student') {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, role })
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
}