// Utility functions for SmartMine dashboard styling

export const statusColors = {
  running: {
    bg: 'bg-green-500',
    text: 'text-green-700',
    border: 'border-green-500',
    light: 'bg-green-100'
  },
  idle: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-700',
    border: 'border-yellow-500',
    light: 'bg-yellow-100'
  },
  maintenance: {
    bg: 'bg-red-500',
    text: 'text-red-700',
    border: 'border-red-500',
    light: 'bg-red-100'
  },
  loading: {
    bg: 'bg-orange-500',
    text: 'text-orange-700',
    border: 'border-orange-500',
    light: 'bg-orange-100'
  },
  hauling: {
    bg: 'bg-blue-500',
    text: 'text-blue-700',
    border: 'border-blue-500',
    light: 'bg-blue-100'
  },
  dumping: {
    bg: 'bg-purple-500',
    text: 'text-purple-700',
    border: 'border-purple-500',
    light: 'bg-purple-100'
  }
};

export const priorityColors = {
  high: {
    bg: 'bg-red-500',
    text: 'text-red-700',
    border: 'border-red-500',
    light: 'bg-red-100'
  },
  medium: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-700',
    border: 'border-yellow-500',
    light: 'bg-yellow-100'
  },
  low: {
    bg: 'bg-blue-500',
    text: 'text-blue-700',
    border: 'border-blue-500',
    light: 'bg-blue-100'
  }
};

export const formatNumber = (num, decimals = 1) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  return num?.toFixed(decimals) || '0';
};

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
};

export const getHealthColor = (health) => {
  if (health >= 80) return 'text-green-600';
  if (health >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getUtilizationColor = (utilization) => {
  if (utilization < 20) return 'bg-red-500';
  if (utilization < 50) return 'bg-yellow-500';
  if (utilization < 90) return 'bg-green-500';
  return 'bg-red-500'; // Over capacity
};

export const gradients = {
  primary: 'bg-gradient-to-br from-blue-500 to-blue-700',
  success: 'bg-gradient-to-br from-green-500 to-green-700',
  warning: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
  danger: 'bg-gradient-to-br from-red-500 to-red-700',
  purple: 'bg-gradient-to-br from-purple-500 to-purple-700',
  mining: 'bg-gradient-to-br from-gray-800 to-gray-900'
};
