import React from 'react';
import type { Task, Status } from '../../types';
import { STATUS_LABELS, STATUS_COLORS, STATUS_ORDER } from '../../types';
import { Avatar } from '../shared/Avatar';
import { Badge } from '../shared/Badge';
import { InlineDropdown } from '../shared/Dropdown';
import { formatDueDate } from '../../utils/dateUtils';
import { useTaskStore } from '../../store/taskStore';

interface ListRowProps {
  task: Task;
  style: React.CSSProperties;
}

const statusDropdownOptions = STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABELS[s] }));

const ListRowComponent: React.FC<ListRowProps> = ({ task, style }) => {
  const moveTask = useTaskStore((s) => s.moveTask);
  const due = formatDueDate(task.dueDate);

  return (
    <div
      style={style}
      className="flex items-center gap-4 px-4 border-b border-slate-100 hover:bg-slate-50/80 transition-all group cursor-default"
    >
      {/* Title + Assignee */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar name={task.assignee} size="sm" />
        <div className="min-w-0">
          <span className="text-sm font-medium text-slate-700 truncate block group-hover:text-indigo-600 transition-colors">
            {task.title}
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-tight uppercase">Assigned to: {task.assignee}</span>
        </div>
      </div>

      {/* Priority */}
      <div className="w-24 shrink-0 px-2 lg:px-0">
        <Badge priority={task.priority} />
      </div>

      {/* Status dropdown */}
      <div className="w-28 shrink-0">
        <div className="w-28 shrink-0">
          <InlineDropdown
            value={task.status}
            options={statusDropdownOptions}
            onChange={(v) => moveTask(task.id, v as Status)}
            colorClass={STATUS_COLORS[task.status]}
          />
        </div>
      </div>

      {/* Due date */}
      <div className="w-28 shrink-0 text-right">
        <span
          className={`text-xs font-bold tabular-nums ${
            due.isDueToday
              ? 'text-amber-600'
              : due.isOverdue
                ? 'text-red-600'
                : 'text-slate-400'
          }`}
        >
          {due.text}
        </span>
      </div>
    </div>
  );
};

export const ListRow = React.memo(ListRowComponent);
