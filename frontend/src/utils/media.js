const BACKEND_ORIGIN = 'http://127.0.0.1:8000';

export const resolveMediaUrl = (value, fallback = '/images/hero-banner.jpg') => {
  if (!value) return fallback;

  if (typeof value !== 'string') return fallback;

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }

  if (value.startsWith('/media/')) {
    return `${BACKEND_ORIGIN}${value}`;
  }

  if (value.startsWith('/')) {
    return value;
  }

  return `${BACKEND_ORIGIN}/${value.replace(/^\/+/, '')}`;
};

export const formatINR = (value, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(Number(value) || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

