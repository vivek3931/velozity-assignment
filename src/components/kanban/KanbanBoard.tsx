import React, { useState, useCallback, useMemo } from 'react';
import type { Task, Status } from '../../types';
import { STATUS_LABELS, STATUS_ORDER } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../shared/EmptyState';

interface ColumnProps {
  status: Status;
  tasks: Task[];
  isOver: boolean;
  dragOverIndex: number;
  draggedTask: Task | null;
  onDragOver: (e: React.DragEvent, status: Status) => void;
  onDrop: (e: React.DragEvent, status: Status) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

const KanbanColumn = React.memo(({
  status,
  tasks,
  isOver,
  dragOverIndex,
  draggedTask,
  onDragOver,
  onDrop,
  onDragLeave,
  onDragEnd,
  onDragStart,
}: ColumnProps) => {
  const columnColors: Record<Status, { header: string; accent: string; dropBg: string; border: string }> = {
    'todo': { header: 'text-slate-500', accent: 'bg-slate-400', dropBg: 'bg-slate-100', border: 'border-slate-200' },
    'in-progress': { header: 'text-indigo-600', accent: 'bg-indigo-500', dropBg: 'bg-indigo-50/50', border: 'border-indigo-100' },
    'in-review': { header: 'text-purple-600', accent: 'bg-purple-500', dropBg: 'bg-purple-50/50', border: 'border-purple-100' },
    'done': { header: 'text-emerald-600', accent: 'bg-emerald-500', dropBg: 'bg-emerald-50/50', border: 'border-emerald-100' },
  };

  const colors = columnColors[status];

  return (
    <div
      className={`flex flex-col rounded-xl border transition-all duration-200 ${
        isOver
          ? `border-indigo-300 ${colors.dropBg} shadow-md`
          : `${colors.border} bg-slate-100/30`
      }`}
      onDragOver={(e) => onDragOver(e, status)}
      onDrop={(e) => onDrop(e, status)}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 bg-white/40 rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${colors.accent}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${colors.header}`}>
            {STATUS_LABELS[status]}
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">
          {tasks.length}
        </span>
      </div>

      {/* Column body - scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks"
            description={`No tasks in ${STATUS_LABELS[status]}`}
          />
        ) : (
          tasks.map((task, _idx) => (
            <React.Fragment key={task.id}>
              {/* Placeholder indicator */}
              {isOver && dragOverIndex === _idx && draggedTask?.id !== task.id && (
                <div className="h-1 rounded-full bg-indigo-500/50 mx-2 transition-all" />
              )}
              <TaskCard
                task={task}
                onDragStart={onDragStart}
                isDragging={draggedTask?.id === task.id}
              />
            </React.Fragment>
          ))
        )}
        {/* Placeholder at end */}
        {isOver && dragOverIndex >= tasks.length && (
          <div className="h-1 rounded-full bg-indigo-500/50 mx-2 transition-all" />
        )}
      </div>
    </div>
  );
});

export const KanbanBoard: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const moveTask = useTaskStore((s) => s.moveTask);

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

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number>(-1);

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);

    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    e.dataTransfer.setDragImage(el, rect.width / 2, 20);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);

    const column = e.currentTarget as HTMLElement;
    const cards = column.querySelectorAll('[data-task-id]');
    let index = cards.length;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const rect = card.getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        index = i;
        break;
      }
    }
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetStatus: Status) => {
    e.preventDefault();
    if (draggedTask) {
      moveTask(draggedTask.id, targetStatus);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
    setDragOverIndex(-1);
  }, [draggedTask, moveTask]);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragOverColumn(null);
    setDragOverIndex(-1);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as Node;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
      setDragOverIndex(-1);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 h-[calc(100vh-180px)]">
      {STATUS_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={filteredTasks.filter((t) => t.status === status)}
          isOver={dragOverColumn === status}
          dragOverIndex={dragOverIndex}
          draggedTask={draggedTask}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
};
