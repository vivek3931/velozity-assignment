import React from 'react';
import type { Priority } from '../../types';
import { PRIORITY_BG } from '../../types';

interface BadgeProps {
  priority: Priority;
}

export const Badge: React.FC<BadgeProps> = ({ priority }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${PRIORITY_BG[priority]}`}
    >
      {priority}
    </span>
  );
};
