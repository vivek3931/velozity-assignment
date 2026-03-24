import React from 'react';
import { getInitials } from '../../utils/dateUtils';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

const AVATAR_COLORS = [
  '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981',
  '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16',
];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export const Avatar: React.FC<AvatarProps> = ({ name, color, size = 'md', className = '' }) => {
  const bg = color || hashColor(name);
  return (
    <div
      className={`${SIZES[size]} rounded-full flex items-center justify-center font-semibold text-white shrink-0 ring-2 ring-slate-900 ${className}`}
      style={{ backgroundColor: bg }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

interface AvatarGroupProps {
  names: { name: string; color?: string }[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ names, max = 3, size = 'sm' }) => {
  const visible = names.slice(0, max);
  const overflow = names.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((n, i) => (
        <Avatar key={i} name={n.name} color={n.color} size={size} />
      ))}
      {overflow > 0 && (
        <div
          className={`${SIZES[size]} rounded-full flex items-center justify-center font-semibold text-white bg-slate-600 ring-2 ring-slate-900 shrink-0`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};
