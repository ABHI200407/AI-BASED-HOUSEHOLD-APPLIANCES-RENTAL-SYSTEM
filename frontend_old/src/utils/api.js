const API_BASE = 'http://localhost:8000/api';

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories/`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function fetchAppliances(params = {}) {
  const url = new URL(`${API_BASE}/appliances/`);
  if (params.category) url.searchParams.append('category', params.category);
  if (params.search) url.searchParams.append('search', params.search);
  if (params.minPrice) url.searchParams.append('min_price', params.minPrice);
  if (params.maxPrice) url.searchParams.append('max_price', params.maxPrice);
  if (params.sort) url.searchParams.append('sort', params.sort);
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch appliances');
  return response.json();
}

export async function fetchAppliance(id) {
  const response = await fetch(`${API_BASE}/appliances/${id}/`);
  if (!response.ok) throw new Error('Failed to fetch appliance');
  return response.json();
}

// ─── ADMIN CRUD API ────────────────────────────────────────────────────────
export async function fetchDashboardStats() {
  const response = await fetch(`${API_BASE}/dashboard/`);
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
}

export async function createAppliance(data) {
  const response = await fetch(`${API_BASE}/appliances/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create appliance');
  return response.json();
}

export async function updateAppliance(id, data) {
  const response = await fetch(`${API_BASE}/appliances/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update appliance');
  return response.json();
}

export async function deleteAppliance(id) {
  const response = await fetch(`${API_BASE}/appliances/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete appliance');
  return true;
}

export async function fetchCustomers() {
  const response = await fetch(`${API_BASE}/customers/`);
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
}

export async function fetchBookings() {
  const response = await fetch(`${API_BASE}/bookings/`);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
}
