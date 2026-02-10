'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import { LocaleSwitch } from '@/components/common/LocaleSwitch';
import { ThemeSwitch } from '@/components/common/ThemeSwitch';

export const HeaderMenu = ({ actions }: { actions?: React.ReactNode }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const isOutside = !containerRef.current?.contains(event.target as Node);
      if (isOutside) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="header-menu" ref={containerRef}>
      <button
        className="icon-button"
        type="button"
        aria-label={t('common.menu')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical size={18} aria-hidden="true" />
      </button>
      {open ? (
        <div className="menu-panel" role="menu">
          <div className="menu-section">
            <span className="menu-label">{t('common.language')}</span>
            <LocaleSwitch />
          </div>
          <div className="menu-section">
            <span className="menu-label">{t('theme.label')}</span>
            <ThemeSwitch />
          </div>
          {actions ? <div className="menu-divider" /> : null}
          {actions ? (
            <div className="menu-actions" onClick={() => setOpen(false)}>
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
