import { create } from 'zustand';
import type { CollabUser } from '../types';

interface CollabStore {
  users: CollabUser[];
  assignments: Record<string, string[]>; // taskId -> userId[]
  startSimulation: (taskIds: string[]) => void;
  stopSimulation: () => void;
}

const SIMULATED_USERS: CollabUser[] = [
  { id: 'collab-1', name: 'Emma Watson', color: '#8b5cf6' },
  { id: 'collab-2', name: 'Liam Park', color: '#06b6d4' },
  { id: 'collab-3', name: 'Zara Khan', color: '#f59e0b' },
];

let intervalId: ReturnType<typeof setInterval> | null = null;

export const useCollabStore = create<CollabStore>((set) => ({
  users: SIMULATED_USERS,
  assignments: {},

  startSimulation: (taskIds: string[]) => {
    if (intervalId) clearInterval(intervalId);
    if (taskIds.length === 0) return;

    // Initial assignment
    const initial: Record<string, string[]> = {};
    SIMULATED_USERS.forEach((user) => {
      const taskId = taskIds[Math.floor(Math.random() * Math.min(taskIds.length, 50))];
      if (!initial[taskId]) initial[taskId] = [];
      initial[taskId].push(user.id);
    });
    set({ assignments: initial });

    intervalId = setInterval(() => {
      const currentTaskIds = taskIds;
      if (currentTaskIds.length === 0) return;

      set((state) => {
        const newAssignments: Record<string, string[]> = {};

        // For each user, move randomly
        const userToTask: Record<string, string> = {};
        // Get current user positions
        for (const [taskId, userIds] of Object.entries(state.assignments)) {
          for (const uid of userIds) {
            userToTask[uid] = taskId;
          }
        }

        // Pick a random user to move
        const userToMove = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
        userToTask[userToMove.id] = currentTaskIds[Math.floor(Math.random() * Math.min(currentTaskIds.length, 50))];

        // Rebuild assignments map
        for (const [uid, taskId] of Object.entries(userToTask)) {
          if (!newAssignments[taskId]) newAssignments[taskId] = [];
          newAssignments[taskId].push(uid);
        }

        return { assignments: newAssignments };
      });
    }, 3500 + Math.random() * 2500);
  },

  stopSimulation: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },
}));

export { SIMULATED_USERS };
