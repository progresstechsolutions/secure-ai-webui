export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const sanitizeHTML = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

interface PaginationResult {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  total: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const pagination = (page: string | number, limit: string | number, total: number): PaginationResult => {
  const currentPage = parseInt(page.toString()) || 1;
  const itemsPerPage = parseInt(limit.toString()) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    total,
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

export const formatTimestamp = (date: Date | string): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};
