'use client';

import type { Task } from '@/core/domain/task';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useI18n } from '@/i18n/I18nProvider';

export const TaskList = ({
  tasks,
  isLoading,
  onDeleteRequest
}: {
  tasks: Task[];
  isLoading: boolean;
  onDeleteRequest: (task: Task) => void;
}) => {
  const { t } = useI18n();
  if (isLoading) {
    return (
      <div className="task-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="task-card skeleton" key={index}>
            <div className="task-header">
              <div className="skeleton-line title" />
              <div className="skeleton-pill" />
            </div>
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="task-meta">
              <div className="skeleton-actions">
                <div className="skeleton-circle" />
                <div className="skeleton-circle" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!tasks.length) {
    return <p className="empty">{t('tasks.empty')}</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDeleteRequest={onDeleteRequest} />
      ))}
    </div>
  );
};
