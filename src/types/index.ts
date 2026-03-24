export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;
  startDate: string | null;
  dueDate: string;
  createdAt: string;
}

export interface CollabUser {
  id: string;
  name: string;
  color: string;
}

export interface FilterState {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export const STATUS_LABELS: Record<Status, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done',
};

export const STATUS_ORDER: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

export const PRIORITY_ORDER: Priority[] = ['critical', 'high', 'medium', 'low'];

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

export const PRIORITY_BG: Record<Priority, string> = {
  critical: 'bg-red-50 text-red-700 border-red-100',
  high: 'bg-orange-50 text-orange-700 border-orange-100',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low: 'bg-blue-50 text-blue-700 border-blue-100',
};

export const STATUS_COLORS: Record<Status, string> = {
  'todo': 'bg-slate-50 text-slate-600 border-slate-200',
  'in-progress': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'in-review': 'bg-purple-50 text-purple-700 border-purple-100',
  'done': 'bg-emerald-50 text-emerald-700 border-emerald-100',
};
