export const useFormatters = () => {
  const formatCurrency = (amount: number | undefined | null): string => {
    const num = Number(amount || 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatBytes = (bytes: number | undefined | null): string => {
    const value = Number(bytes || 0);
    if (value === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(
      units.length - 1,
      Math.floor(Math.log(value) / Math.log(1024)),
    );
    const scaled = value / Math.pow(1024, index);
    return `${scaled.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const formatDate = (isoString: string | undefined | null): string => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  };

  const formatDateTime = (isoString: string | undefined | null): string => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return {
    formatCurrency,
    formatBytes,
    formatDate,
    formatDateTime,
  };
};
