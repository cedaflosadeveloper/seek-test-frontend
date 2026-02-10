import { LocaleSwitch } from '@/components/common/LocaleSwitch';

export const AppShell = ({
  title,
  leftSlot,
  subtitle,
  rightSlot,
  children
}: {
  title: string;
  leftSlot?: React.ReactNode;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          {leftSlot ? <div className="header-left-slot">{leftSlot}</div> : null}
          <div className="header-titles">
            <h1>{title}</h1>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
        </div>
        <div className="header-actions">
          {rightSlot ? <div>{rightSlot}</div> : null}
          <LocaleSwitch />
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};
