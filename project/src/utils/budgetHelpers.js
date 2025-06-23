// Enhanced utility functions for the Budget Page

export const getBudgetStatusDescription = (allocated, spent) => {
  const pct = (spent / allocated) * 100;
  if (pct > 100) return 'Budget exceeded. Immediate action required.';
  if (pct > 90) return 'Budget nearly depleted. Review spending.';
  if (pct > 75) return 'Budget usage high. Monitor closely.';
  return 'Budget within limits.';
};

export default { getBudgetStatusDescription };
