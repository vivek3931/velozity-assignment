import React, { useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { ListRow } from './ListRow';
import { EmptyState } from '../shared/EmptyState';
import type { SortField } from '../../types';
import { PRIORITY_ORDER } from '../../types';

const ROW_HEIGHT = 56;

export const ListView: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const sortField = useTaskStore((s) => s.sortField);
  const sortDirection = useTaskStore((s) => s.sortDirection);
  const setSort = useTaskStore((s) => s.setSort);
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

  const sortedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
      if (filters.assignee.length > 0 && !filters.assignee.includes(task.assignee)) return false;
      if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom) return false;
      if (filters.dueDateTo && task.dueDate > filters.dueDateTo) return false;
      return true;
    });

    const dir = sortDirection === 'asc' ? 1 : -1;

    return [...filtered].sort((a, b) => {
      switch (sortField) {
        case 'title':
          return dir * a.title.localeCompare(b.title);
        case 'priority': {
          const aIdx = PRIORITY_ORDER.indexOf(a.priority);
          const bIdx = PRIORITY_ORDER.indexOf(b.priority);
          return dir * (aIdx - bIdx);
        }
        case 'dueDate':
          return dir * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        default:
          return 0;
      }
    });
  }, [tasks, filters, sortField, sortDirection]);

  const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 260 : 600;

  const {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    containerRef,
    onScroll,
  } = useVirtualScroll({
    itemCount: sortedTasks.length,
    itemHeight: ROW_HEIGHT,
    containerHeight,
    buffer: 5,
  });

  const visibleTasks = useMemo(
    () => sortedTasks.slice(startIndex, endIndex + 1),
    [sortedTasks, startIndex, endIndex]
  );

  const renderSortHeader = (label: string, field: SortField, width: string) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => setSort(field)}
        className={`${width} flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold cursor-pointer transition-all ${
          isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {label}
        {isActive && (
          <svg
            className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>
    );
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No tasks found"
          description="Try adjusting your filters to find what you're looking for."
          actionLabel={hasActive ? 'Clear filters' : undefined}
          onAction={hasActive ? clearFilters : undefined}
        />
      </div>
    );
  }

  return (
    <div className="p-4 overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="min-w-[800px]">
          {/* Table header */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            {renderSortHeader('Task', 'title', 'flex-1')}
            {renderSortHeader('Priority', 'priority', 'w-24 shrink-0')}
            <span className="w-28 shrink-0 text-[11px] uppercase tracking-wider font-bold text-slate-400 px-1">Status</span>
            {renderSortHeader('Due Date', 'dueDate', 'w-28 shrink-0 justify-end')}
          </div>

          {/* Virtual scrolled list */}
          <div
            ref={containerRef}
            onScroll={onScroll}
            className="overflow-y-auto"
            style={{ height: containerHeight }}
          >
            <div style={{ height: totalHeight, position: 'relative' }}>
              <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
                {visibleTasks.map((task) => (
                  <ListRow
                    key={task.id}
                    task={task}
                    style={{ height: ROW_HEIGHT }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row count */}
      <div className="flex justify-between items-center mt-2 px-1">
        <span className="text-[11px] text-slate-500 font-medium">
          {sortedTasks.length} tasks · Showing rows {startIndex + 1}–{Math.min(endIndex + 1, sortedTasks.length)}
        </span>
        <span className="text-[11px] text-slate-400">
          Virtual rendering: {endIndex - startIndex + 1} rows
        </span>
      </div>
    </div>
  );
};
