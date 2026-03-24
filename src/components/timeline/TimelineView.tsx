import React, { useMemo, useRef } from 'react';
import { useTaskStore } from '../../store/taskStore';
import type { Task } from '../../types';
import { PRIORITY_COLORS } from '../../types';
import { EmptyState } from '../shared/EmptyState';
import { toDateString } from '../../utils/dateUtils';

const DAY_WIDTH = 40;
const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 50;
const LABEL_WIDTH = 260;

export const TimelineView: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const clearFilters = useTaskStore((s) => s.clearFilters);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
      if (filters.assignee.length > 0 && !filters.assignee.includes(task.assignee)) return false;
      if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom) return false;
      if (filters.dueDateTo && task.dueDate > filters.dueDateTo) return false;
      return true;
    });
  }, [tasks, filters]);

  const hasActive = useMemo(() => {
    return (
      filters.status.length > 0 ||
      filters.priority.length > 0 ||
      filters.assignee.length > 0 ||
      filters.dueDateFrom !== '' ||
      filters.dueDateTo !== ''
    );
  }, [filters]);


  // Compute date range: current month ± 1 week
  const now = new Date();
  const rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
  rangeStart.setDate(rangeStart.getDate() - 7);
  const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  rangeEnd.setDate(rangeEnd.getDate() + 7);

  const days = useMemo(() => {
    const result: Date[] = [];
    const d = new Date(rangeStart);
    while (d <= rangeEnd) {
      result.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return result;
  }, [rangeStart.toISOString(), rangeEnd.toISOString()]);

  const todayStr = toDateString(now);
  const todayIndex = days.findIndex((d) => toDateString(d) === todayStr);
  const totalWidth = days.length * DAY_WIDTH;

  // Only show tasks that have dates within or near our range
  const timelineTasks = useMemo(() => {
    return filteredTasks.filter((t) => {
      const due = t.dueDate;
      const start = t.startDate || due;
      return start <= toDateString(rangeEnd) && due >= toDateString(rangeStart);
    });
  }, [filteredTasks, rangeStart, rangeEnd]);

  const getBarPosition = (task: Task) => {
    const startStr = task.startDate || task.dueDate;
    const endStr = task.dueDate;

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    const startDiff = Math.round((startDate.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
    const endDiff = Math.round((endDate.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));

    const left = Math.max(0, startDiff * DAY_WIDTH);
    const width = Math.max(DAY_WIDTH * 0.6, (endDiff - startDiff + 1) * DAY_WIDTH - 4);
    const isSingleDay = !task.startDate || task.startDate === task.dueDate;

    return { left, width, isSingleDay };
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No tasks to display"
          description="Adjust your filters to see tasks on the timeline."
          actionLabel={hasActive ? 'Clear filters' : undefined}
          onAction={hasActive ? clearFilters : undefined}
        />
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-4 overflow-hidden">
      <div className="sm:rounded-xl border sm:border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="flex">
          {/* Task labels column (sticky) */}
          <div className="shrink-0 border-r border-slate-100 bg-white z-10" style={{ width: LABEL_WIDTH }}>
            {/* Header spacer */}
            <div className="h-[50px] border-b border-slate-100 px-4 flex items-center bg-slate-50/50">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Task Title</span>
            </div>
            {/* Task labels */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {timelineTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2.5 px-4 border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                  style={{ height: ROW_HEIGHT }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
                  />
                  <span className="text-xs font-medium text-slate-600 truncate">{task.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable timeline area */}
          <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 230px)' }}>
            <div style={{ width: totalWidth, minWidth: '100%' }}>
              {/* Day headers */}
              <div className="flex border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-5" style={{ height: HEADER_HEIGHT }}>
                {days.map((day, idx) => {
                  const dateStr = toDateString(day);
                  const isToday = dateStr === todayStr;
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const isFirst = day.getDate() === 1;

                  return (
                    <div
                      key={idx}
                      className={`shrink-0 flex flex-col items-center justify-center border-r border-slate-50 ${
                        isToday ? 'bg-indigo-50/50' : isWeekend ? 'bg-slate-50/30' : ''
                      } ${isFirst ? 'border-l border-l-slate-200' : ''}`}
                      style={{ width: DAY_WIDTH }}
                    >
                      {isFirst && (
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                          {day.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-bold ${
                          isToday
                            ? 'text-indigo-600 bg-indigo-50 rounded-full w-5 h-5 flex items-center justify-center ring-1 ring-indigo-200/50'
                            : isWeekend
                              ? 'text-slate-300'
                              : 'text-slate-400'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Task bars */}
              <div className="relative">
                {/* Today line */}
                {todayIndex >= 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-10 pointer-events-none"
                    style={{ left: todayIndex * DAY_WIDTH + DAY_WIDTH / 2 }}
                  >
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full" />
                  </div>
                )}

                {/* Grid container with CSS background for lines */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${DAY_WIDTH - 1}px, #f1f5f9 ${DAY_WIDTH - 1}px, #f1f5f9 ${DAY_WIDTH}px)`,
                    backgroundSize: `${DAY_WIDTH}px 100%`
                  }}
                >
                  {/* Weekend overlays - fewer divs than full grid */}
                  {days.map((day, idx) => {
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    if (!isWeekend) return null;
                    return (
                      <div
                        key={idx}
                        className="absolute top-0 bottom-0 bg-slate-50/50"
                        style={{ left: idx * DAY_WIDTH, width: DAY_WIDTH }}
                      />
                    );
                  })}
                </div>

                {/* Task rows */}
                {timelineTasks.map((task) => {
                  const { left, width, isSingleDay } = getBarPosition(task);
                  const color = PRIORITY_COLORS[task.priority];

                  return (
                    <div
                      key={task.id}
                      className="relative border-b border-slate-50"
                      style={{ height: ROW_HEIGHT }}
                    >
                      {isSingleDay ? (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
                          style={{ left: left + DAY_WIDTH / 2 - 6, backgroundColor: color }}
                          title={`${task.title} (${task.dueDate})`}
                        />
                      ) : (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 rounded-full h-5 shadow-sm hover:shadow-md transition-all cursor-default group overflow-hidden"
                          style={{ left, width, backgroundColor: color + '20', border: `1px solid ${color + '40'}`, borderLeft: `3px solid ${color}` }}
                          title={`${task.title} (${task.startDate} → ${task.dueDate})`}
                        >
                          <div className="h-full rounded-full opacity-30 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: color, width: '100%' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 px-1">
        <span className="text-[11px] text-slate-600">{timelineTasks.length} tasks on timeline</span>
        <div className="flex items-center gap-3">
          {(['critical', 'high', 'medium', 'low'] as const).map((p) => (
            <div key={p} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[p] }} />
              <span className="text-[10px] text-slate-600 capitalize">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
