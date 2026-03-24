import { useEffect, useRef, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Status, Priority, FilterState } from '../types';

export function useUrlFilters() {
  const filters = useTaskStore((s) => s.filters);
  const setFilter = useTaskStore((s) => s.setFilter);
  const clearFilters = useTaskStore((s) => s.clearFilters);
  const initialized = useRef(false);

  // Parse URL on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const params = new URLSearchParams(window.location.search);

    const status = params.get('status');
    if (status) setFilter('status', status.split(',') as Status[]);

    const priority = params.get('priority');
    if (priority) setFilter('priority', priority.split(',') as Priority[]);

    const assignee = params.get('assignee');
    if (assignee) setFilter('assignee', assignee.split(','));

    const from = params.get('dueDateFrom');
    if (from) setFilter('dueDateFrom', from);

    const to = params.get('dueDateTo');
    if (to) setFilter('dueDateTo', to);
  }, [setFilter]);

  // Sync filters to URL
  useEffect(() => {
    if (!initialized.current) return;
    const params = new URLSearchParams();

    if (filters.status.length > 0) params.set('status', filters.status.join(','));
    if (filters.priority.length > 0) params.set('priority', filters.priority.join(','));
    if (filters.assignee.length > 0) params.set('assignee', filters.assignee.join(','));
    if (filters.dueDateFrom) params.set('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo) params.set('dueDateTo', filters.dueDateTo);

    const search = params.toString();
    const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [filters]);

  // Handle popstate
  const handlePopState = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const newFilters: FilterState = {
      status: params.get('status')?.split(',').filter(Boolean) as Status[] || [],
      priority: params.get('priority')?.split(',').filter(Boolean) as Priority[] || [],
      assignee: params.get('assignee')?.split(',').filter(Boolean) || [],
      dueDateFrom: params.get('dueDateFrom') || '',
      dueDateTo: params.get('dueDateTo') || '',
    };

    // Reset all filters and apply from URL
    clearFilters();
    if (newFilters.status.length) setFilter('status', newFilters.status);
    if (newFilters.priority.length) setFilter('priority', newFilters.priority);
    if (newFilters.assignee.length) setFilter('assignee', newFilters.assignee);
    if (newFilters.dueDateFrom) setFilter('dueDateFrom', newFilters.dueDateFrom);
    if (newFilters.dueDateTo) setFilter('dueDateTo', newFilters.dueDateTo);
  }, [clearFilters, setFilter]);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);
}
