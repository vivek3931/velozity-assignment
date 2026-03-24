import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { FilterBar } from './components/layout/FilterBar';
import { ViewSwitcher } from './components/layout/ViewSwitcher';
import type { ViewType } from './components/layout/ViewSwitcher';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';
import { useUrlFilters } from './hooks/useUrlFilters';
import { useCollabStore } from './store/collaborationStore';
import { useTaskStore } from './store/taskStore';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const startSimulation = useCollabStore((s) => s.startSimulation);
  const stopSimulation = useCollabStore((s) => s.stopSimulation);
  const tasks = useTaskStore((s) => s.tasks);

  // Sync URL filters
  useUrlFilters();

  // Start collaboration simulation
  useEffect(() => {
    const taskIds = tasks.map((t) => t.id);
    startSimulation(taskIds);
    return () => stopSimulation();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header>
        <ViewSwitcher current={currentView} onChange={setCurrentView} />
      </Header>

      <div className="max-w-[1600px] mx-auto">
        <FilterBar />

        <div className="relative">
          {currentView === 'kanban' && <KanbanBoard />}
          {currentView === 'list' && <ListView />}
          {currentView === 'timeline' && <TimelineView />}
        </div>
      </div>
    </div>
  );
}

export default App;
