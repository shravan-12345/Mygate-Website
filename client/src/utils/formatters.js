// Small formatting helpers reused across dashboard pages, kept in one place
// so date/currency formatting stays consistent everywhere.

export const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '—';
  return `Rs. ${Number(value).toLocaleString('en-IN')}`;
};

// Turns 'pending_approval' into 'Pending Approval' as a fallback when no
// explicit label map exists for a given value.
export const titleCase = (value = '') =>
  value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
