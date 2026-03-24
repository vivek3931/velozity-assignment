import type { Task, Status, Priority } from '../types';

const FIRST_NAMES = ['Alex', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Taylor', 'Quinn', 'Avery', 'Sage', 'Drew'];
const LAST_NAMES = ['Chen', 'Patel', 'Kim', 'Garcia', 'Wilson', 'Lopez', 'Ali', 'Singh', 'Brown', 'Lee'];

const TASK_PREFIXES = [
  'Implement', 'Design', 'Fix', 'Update', 'Refactor', 'Optimize', 'Add', 'Remove', 'Create', 'Build',
  'Review', 'Test', 'Deploy', 'Configure', 'Migrate', 'Document', 'Research', 'Analyze', 'Debug', 'Setup',
];

const TASK_SUBJECTS = [
  'user authentication flow', 'dashboard analytics', 'payment gateway integration', 'email notification system',
  'database schema migration', 'REST API endpoints', 'user profile page', 'search functionality',
  'file upload service', 'caching layer', 'CI/CD pipeline', 'error handling middleware',
  'unit test coverage', 'dark mode toggle', 'responsive sidebar', 'data export feature',
  'rate limiter', 'session management', 'role-based access control', 'WebSocket connections',
  'image compression pipeline', 'localization support', 'accessibility audit fixes', 'performance benchmarks',
  'GraphQL resolver', 'SSR hydration logic', 'logging infrastructure', 'health check endpoint',
  'password reset flow', 'two-factor authentication', 'onboarding wizard', 'notification preferences',
  'comment threading system', 'activity feed', 'keyboard shortcuts', 'batch processing job',
  'API versioning strategy', 'S3 bucket policies', 'load balancer config', 'monitoring alerts',
  'user invite system', 'custom form builder', 'drag-and-drop editor', 'rich text formatting',
  'CSV import parser', 'webhook delivery system', 'audit log viewer', 'feature flag system',
  'A/B testing framework', 'SEO meta tags', 'sitemap generator', 'cookie consent banner',
];

const STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];
const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function generateAssignees(): string[] {
  return FIRST_NAMES.map((first, i) => `${first} ${LAST_NAMES[i]}`);
}

export function generateTasks(count: number = 500): Task[] {
  const assignees = generateAssignees();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const rangeStart = new Date(monthStart);
  rangeStart.setDate(rangeStart.getDate() - 14);
  const rangeEnd = new Date(monthStart);
  rangeEnd.setMonth(rangeEnd.getMonth() + 1);
  rangeEnd.setDate(rangeEnd.getDate() + 14);

  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const prefix = randomFrom(TASK_PREFIXES);
    const subject = randomFrom(TASK_SUBJECTS);
    const title = `${prefix} ${subject}`;

    const dueDate = randomDate(rangeStart, rangeEnd);
    const hasStartDate = Math.random() > 0.15;
    let startDate: Date | null = null;

    if (hasStartDate) {
      const startOffset = Math.floor(Math.random() * 14) + 1;
      startDate = new Date(dueDate);
      startDate.setDate(startDate.getDate() - startOffset);
    }

    tasks.push({
      id: `task-${i + 1}`,
      title,
      status: randomFrom(STATUSES),
      priority: randomFrom(PRIORITIES),
      assignee: randomFrom(assignees),
      startDate: startDate ? toISODate(startDate) : null,
      dueDate: toISODate(dueDate),
      createdAt: toISODate(randomDate(rangeStart, now)),
    });
  }

  return tasks;
}
