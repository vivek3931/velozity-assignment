import React from 'react';
import { useCollabStore } from '../../store/collaborationStore';
import { Avatar, AvatarGroup } from '../shared/Avatar';

export const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const users = useCollabStore((s) => s.users);
  const assignments = useCollabStore((s) => s.assignments);

  const activeUserCount = new Set(Object.values(assignments).flat()).size;

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:h-24 py-4 sm:py-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <img src="/logo.png" alt="ProjectFlow" className="h-16 sm:h-20 w-auto object-contain" />
          </div>

          <div className="order-3 sm:order-2 w-full sm:w-auto">
            {children}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto order-2 sm:order-3">
            <div className="flex items-center gap-2">
              <AvatarGroup
                names={users.map((u) => ({ name: u.name, color: u.color }))}
                max={4}
                size="sm"
              />
              <span className="text-[11px] text-slate-500">
                {activeUserCount > 0 ? `${activeUserCount} ${activeUserCount === 1 ? 'person' : 'people'} viewing` : 'No one else here'}
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-200" />
            <Avatar name="You" size="sm" color="#10b981" />
          </div>
        </div>
      </div>
    </header>
  );
};
