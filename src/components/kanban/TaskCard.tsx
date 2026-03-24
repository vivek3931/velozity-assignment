import React, { useMemo } from 'react';
import type { Task } from '../../types';
import { Avatar, AvatarGroup } from '../shared/Avatar';
import { Badge } from '../shared/Badge';
import { formatDueDate } from '../../utils/dateUtils';
import { useCollabStore } from '../../store/collaborationStore';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  isDragging?: boolean;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({ task, isDragging, onDragStart }) => {
  const assignments = useCollabStore((s) => s.assignments);
  const users = useCollabStore((s) => s.users);

  const collabUsers = useMemo(() => {
    return (assignments[task.id] || [])
      .map((uid: string) => users.find((u) => u.id === uid))
      .filter(Boolean) as { id: string; name: string; color: string }[];
  }, [assignments, users, task.id]);

  const due = formatDueDate(task.dueDate);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className={`group bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:shadow-slate-200/50 relative select-none ${
        isDragging ? 'opacity-40 scale-95' : 'shadow-sm'
      }`}
      data-task-id={task.id}
    >
      {collabUsers.length > 0 && (
        <div className="absolute -top-1.5 -right-1.5 z-10">
          <AvatarGroup
            names={collabUsers.map((u) => ({ name: u.name, color: u.color }))}
            max={2}
            size="sm"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {task.title}
        </h3>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Avatar name={task.assignee} size="sm" />
          <span className="text-[11px] font-medium text-slate-500 truncate max-w-[80px]">{task.assignee.split(' ')[0]}</span>
        </div>
        <span
          className={`text-[11px] font-bold ${
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

export const TaskCard = React.memo(TaskCardComponent);
