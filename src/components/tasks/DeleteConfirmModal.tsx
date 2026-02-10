'use client';

import { useI18n } from '@/i18n/I18nProvider';

export const DeleteConfirmModal = ({
  title,
  isOpen,
  onConfirm,
  onCancel,
  message,
  confirmLabel
}: {
  title: React.ReactNode;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  confirmLabel?: string;
}) => {
  const { t } = useI18n();
  const resolvedMessage = message ?? t('common.confirmation');
  const resolvedConfirmLabel = confirmLabel ?? t('common.yes');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={t('common.confirmation')}>
      <div className="modal">
        <h3>{resolvedMessage}</h3>
        <p className="muted">{title}</p>
        <div className="modal-actions">
          <button className="ghost" type="button" onClick={onCancel}>
            {t('common.no')}
          </button>
          <button className="primary danger" type="button" onClick={onConfirm}>
            {resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
