import React, { useMemo } from 'react';
import { Dropdown } from '../shared/Dropdown';
import { Button } from '../shared/Button';
import { useTaskStore } from '../../store/taskStore';
import type { Status, Priority } from '../../types';
import { STATUS_LABELS, STATUS_ORDER, PRIORITY_ORDER } from '../../types';
import { generateAssignees } from '../../data/generator';

const statusOptions = STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABELS[s] }));
const priorityOptions = PRIORITY_ORDER.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }));
const assigneeOptions = generateAssignees().map((a) => ({ value: a, label: a }));

export const FilterBar: React.FC = () => {
  const filters = useTaskStore((s) => s.filters);
  const setFilter = useTaskStore((s) => s.setFilter);
  const clearFilters = useTaskStore((s) => s.clearFilters);

  const hasActive = useMemo(() => {
    return (
      filters.status.length > 0 ||
      filters.priority.length > 0 ||
      filters.assignee.length > 0 ||
      filters.dueDateFrom !== '' ||
      filters.dueDateTo !== ''
    );
  }, [filters]);

  return (
    <div className="flex items-center gap-3 flex-wrap py-3 px-4 bg-white border-b border-slate-200">
      <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1.5 uppercase tracking-wider">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </span>

      <Dropdown
        id="filter-status"
        label="Status"
        options={statusOptions}
        selected={filters.status}
        onChange={(v) => setFilter('status', v as Status[])}
      />

      <Dropdown
        id="filter-priority"
        label="Priority"
        options={priorityOptions}
        selected={filters.priority}
        onChange={(v) => setFilter('priority', v as Priority[])}
      />

      <Dropdown
        id="filter-assignee"
        label="Assignee"
        options={assigneeOptions}
        selected={filters.assignee}
        onChange={(v) => setFilter('assignee', v)}
      />

      <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-lg border border-slate-200">
        <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-tighter">From</label>
        <input
          type="date"
          value={filters.dueDateFrom}
          onChange={(e) => setFilter('dueDateFrom', e.target.value)}
          className="bg-white border-slate-200 rounded-md px-1.5 py-1 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-tighter">To</label>
        <input
          type="date"
          value={filters.dueDateTo}
          onChange={(e) => setFilter('dueDateTo', e.target.value)}
          className="bg-white border-slate-200 rounded-md px-1.5 py-1 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {hasActive && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear all
        </Button>
      )}
    </div>
  );
};
