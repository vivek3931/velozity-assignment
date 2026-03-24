import { create } from 'zustand';
import type { Task, Status, FilterState, SortField, SortDirection } from '../types';
import { generateTasks } from '../data/generator';

interface TaskStore {
  tasks: Task[];
  filters: FilterState;
  sortField: SortField;
  sortDirection: SortDirection;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  setSort: (field: SortField) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
}

const defaultFilters: FilterState = {
  status: [],
  priority: [],
  assignee: [],
  dueDateFrom: '',
  dueDateTo: '',
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: generateTasks(500),
  filters: { ...defaultFilters },
  sortField: 'title',
  sortDirection: 'asc',

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  clearFilters: () => {
    set({ filters: { ...defaultFilters } });
  },

  setSort: (field: SortField) => {
    set((state) => ({
      sortField: field,
      sortDirection: state.sortField === field && state.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  },

  moveTask: (taskId: string, newStatus: Status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    }));
  },
}));

