// Mirrors server/config/constants.js so the frontend never hardcodes role/status
// strings inline. Display labels are kept alongside the raw values used in API calls.

export const ROLES = {
  RESIDENT: 'resident',
  SECURITY: 'security',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.RESIDENT]: 'Resident',
  [ROLES.SECURITY]: 'Security Guard',
  [ROLES.ADMIN]: 'Society Admin',
};

export const VISITOR_STATUS = {
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
};

export const VISITOR_STATUS_LABELS = {
  [VISITOR_STATUS.PENDING_APPROVAL]: 'Pending Approval',
  [VISITOR_STATUS.APPROVED]: 'Approved',
  [VISITOR_STATUS.REJECTED]: 'Rejected',
  [VISITOR_STATUS.CHECKED_IN]: 'Checked In',
  [VISITOR_STATUS.CHECKED_OUT]: 'Checked Out',
};

// Maps a status value to a Badge `variant` (see components/Badge usage in Table cells)
export const VISITOR_STATUS_VARIANT = {
  [VISITOR_STATUS.PENDING_APPROVAL]: 'warning',
  [VISITOR_STATUS.APPROVED]: 'info',
  [VISITOR_STATUS.REJECTED]: 'danger',
  [VISITOR_STATUS.CHECKED_IN]: 'success',
  [VISITOR_STATUS.CHECKED_OUT]: 'neutral',
};

export const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const COMPLAINT_STATUS_VARIANT = {
  [COMPLAINT_STATUS.OPEN]: 'warning',
  [COMPLAINT_STATUS.IN_PROGRESS]: 'info',
  [COMPLAINT_STATUS.RESOLVED]: 'success',
  [COMPLAINT_STATUS.REJECTED]: 'danger',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
};

export const PAYMENT_STATUS_VARIANT = {
  [PAYMENT_STATUS.PENDING]: 'warning',
  [PAYMENT_STATUS.PAID]: 'success',
  [PAYMENT_STATUS.OVERDUE]: 'danger',
};

export const EMERGENCY_CATEGORY_LABELS = {
  hospital: 'Hospital',
  police: 'Police',
  fire_brigade: 'Fire Brigade',
  society_office: 'Society Office',
  electrician: 'Electrician',
  plumber: 'Plumber',
  ambulance: 'Ambulance',
};
