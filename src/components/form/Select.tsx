'use client';

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

type Option = {
  value: string;
  label: string;
};

export const Select = ({
  id,
  name,
  value,
  options,
  onChange,
  placeholder,
  containerRef: externalRef
}: {
  id?: string;
  name?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  containerRef?: RefObject<HTMLDivElement>;
}) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef ?? internalRef;
  const resolvedPlaceholder = placeholder ?? t('common.selectOption');

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
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
    <div className="select" ref={containerRef}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        type="button"
        className="select-trigger"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected?.label ?? resolvedPlaceholder}</span>
        <span className="select-caret" aria-hidden="true" />
      </button>
      {open ? (
        <ul className="select-menu" role="listbox">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`select-option ${opt.value === value ? 'active' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                role="option"
                aria-selected={opt.value === value}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
