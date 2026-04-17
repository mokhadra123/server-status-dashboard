import AccountMenu from "./account-menu";
import ThemeSwitcher from "./theme-switcher";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-paper">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <h1 className="text-xl font-extrabold tracking-tight text-primary">
          XOrithm
        </h1>
        <p className="ml-3 hidden text-sm text-text-secondary sm:block">
          Server Status
        </p>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <ThemeSwitcher />

          {/* Account menu */}
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
