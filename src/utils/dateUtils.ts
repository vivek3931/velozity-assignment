export function formatDueDate(dueDate: string): { text: string; isOverdue: boolean; isDueToday: boolean; daysOverdue: number } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate);
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffMs = dueDay.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { text: 'Due Today', isOverdue: false, isDueToday: true, daysOverdue: 0 };
  }

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    if (overdueDays > 7) {
      return { text: `${overdueDays} days overdue`, isOverdue: true, isDueToday: false, daysOverdue: overdueDays };
    }
    return {
      text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isOverdue: true,
      isDueToday: false,
      daysOverdue: overdueDays,
    };
  }

  return {
    text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue: false,
    isDueToday: false,
    daysOverdue: 0,
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
