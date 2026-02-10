'use client';

import { useI18n } from '@/i18n/I18nProvider';

export const Toast = ({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => {
  const { t } = useI18n();
  if (!message) return null;

  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button className="toast-close" type="button" onClick={onClose} aria-label={t('common.close')}>
        ×
      </button>
    </div>
  );
};
