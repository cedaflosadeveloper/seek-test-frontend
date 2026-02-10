'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@/core/domain/task';
import { useI18n } from '@/i18n/I18nProvider';

export const TaskCard = ({
  task,
  onDeleteRequest
}: {
  task: Task;
  onDeleteRequest: (task: Task) => void;
}) => {
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);
  const hasLongTitle = task.title.length > 50;
  const { t } = useI18n();

  return (
    <article className="task-card">
      <div className="task-header">
        <div className="title-tooltip">
          {hasLongTitle ? (
            <>
              <button
                type="button"
                className="title-tooltip-trigger"
                onClick={() => setShowTitleTooltip((prev) => !prev)}
                aria-expanded={showTitleTooltip}
              >
                {task.title}
              </button>
              {showTitleTooltip ? (
                <span className="title-tooltip-content" role="tooltip">
                  {task.title}
                </span>
              ) : null}
            </>
          ) : (
            <h3 className="task-title">{task.title}</h3>
          )}
        </div>
        <span className={`status ${task.status}`}>{t(`status.${task.status}`)}</span>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-meta">
        <div className="task-actions">
          <Link className="icon-button" href={`/tasks/${task.id}`} aria-label={t('common.edit')}>
            <Pencil size={18} aria-hidden="true" />
          </Link>
          <button
            className="icon-button danger"
            type="button"
            onClick={() => onDeleteRequest(task)}
            aria-label={t('common.delete')}
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};
