import { HeaderMenu } from '@/components/common/HeaderMenu';

export const AppShell = ({
  title,
  leftSlot,
  subtitle,
  menuUser,
  menuActions,
  children
}: {
  title: string;
  leftSlot?: React.ReactNode;
  subtitle?: string;
  menuUser?: string | null;
  menuActions?: React.ReactNode;
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
          <HeaderMenu actions={menuActions} user={menuUser} />
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};
