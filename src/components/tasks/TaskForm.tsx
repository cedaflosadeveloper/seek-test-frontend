'use client';

import { useEffect, useState } from 'react';
import type { TaskStatus } from '@/core/domain/task';
import { Trash2 } from 'lucide-react';
import { Select } from '@/components/form/Select';
import { useI18n } from '@/i18n/I18nProvider';

type TaskFormMode = 'create' | 'edit';

export const TaskForm = ({
  mode,
  initialTitle = '',
  initialDescription = '',
  initialStatus = 'todo',
  resetOnSubmit = true,
  onDelete,
  onSubmit,
  isLoading
}: {
  mode: TaskFormMode;
  initialTitle?: string;
  initialDescription?: string;
  initialStatus?: TaskStatus;
  resetOnSubmit?: boolean;
  onDelete?: () => void;
  onSubmit: (data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
  isLoading: boolean;
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useI18n();
  const isValid = Boolean(title.trim() && description.trim());
  const isChanged =
    title.trim() !== initialTitle.trim() ||
    description.trim() !== initialDescription.trim() ||
    status !== initialStatus;

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setStatus(initialStatus);
  }, [initialTitle, initialDescription, initialStatus]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ title, description, status });
      if (mode === 'create' && resetOnSubmit) {
        setTitle('');
        setDescription('');
        setStatus('todo');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-row-header">
          <label htmlFor="title">{t('taskForm.titleLabel')}</label>
          {mode === 'edit' && onDelete ? (
            <button
              className="icon-button danger"
              type="button"
              onClick={onDelete}
              aria-label={t('common.delete')}
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={
            mode === 'create' ? t('taskForm.titlePlaceholderCreate') : t('taskForm.titlePlaceholderEdit')
          }
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="description">{t('taskForm.descriptionLabel')}</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t('taskForm.descriptionPlaceholder')}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="status">{t('taskForm.statusLabel')}</label>
        <Select
          id="status"
          name="status"
          value={status}
          onChange={(value) => setStatus(value as TaskStatus)}
          placeholder={t('common.selectOption')}
          options={[
            { value: 'todo', label: t('status.todo') },
            { value: 'in_progress', label: t('status.in_progress') },
            { value: 'done', label: t('status.done') }
          ]}
        />
      </div>
      <div className="form-actions">
        <button
          className="primary"
          type="submit"
          disabled={isLoading || isSubmitting || !isValid || (mode === 'edit' && !isChanged)}
        >
          {isLoading || isSubmitting ? t('taskForm.saving') : t('taskForm.save')}
        </button>
      </div>
    </form>
  );
};
