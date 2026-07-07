import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Gamepad2,
  Home,
  Library,
  MonitorCog,
  Settings,
  LogIn,
  Menu,
  X,
  Download,
  Image,
  Save,
  MonitorSmartphone,
  ScrollText,
  ChevronDown,
} from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

const mainLinks: { to: string; key: TKey; icon: React.ElementType }[] = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/library", key: "nav.library", icon: Library },
  { to: "/my-pc", key: "nav.mypc", icon: MonitorCog },
  { to: "/settings", key: "nav.settings", icon: Settings },
];

// Future feature placeholders — reserved navigation, not yet routable.
const futureLinks: { key: TKey; icon: React.ElementType }[] = [
  { key: "nav.downloads", icon: Download },
  { key: "nav.screenshots", icon: Image },
  { key: "nav.saves", icon: Save },
  { key: "nav.remote", icon: MonitorSmartphone },
  { key: "nav.activity", icon: ScrollText },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.73_0.19_129/0.5)]">
        <Gamepad2 className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">
        LAVE <span className="text-primary">PLAY</span>
      </span>
    </Link>
  );
}

export function NavBar() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5">
        <Logo />

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "!text-primary bg-primary/10" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              <l.icon className="h-4 w-4" />
              {t(l.key)}
            </Link>
          ))}

          {/* More dropdown (future features) */}
          <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onMouseEnter={() => setMoreOpen(true)}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.more")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="glass absolute right-0 top-full mt-2 w-56 rounded-2xl p-2"
                >
                  {futureLinks.map((l) => (
                    <div
                      key={l.key}
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground"
                    >
                      <span className="flex items-center gap-2.5">
                        <l.icon className="h-4 w-4" />
                        {t(l.key)}
                      </span>
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                        {t("nav.soon")}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-glow hover:shadow-[0_0_20px_oklch(0.73_0.19_129/0.5)] sm:flex"
          >
            <LogIn className="h-4 w-4" />
            {t("nav.login")}
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl text-foreground lg:hidden"
            aria-label="menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile / tablet menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass mx-auto mt-2 max-w-7xl rounded-2xl p-3 lg:hidden"
          >
            <div className="grid gap-1">
              {mainLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                  activeProps={{ className: "!text-primary bg-primary/10" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  <l.icon className="h-5 w-5" />
                  {t(l.key)}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-bold text-primary-foreground"
              >
                <LogIn className="h-5 w-5" />
                {t("nav.login")}
              </Link>
            </div>

            <div className="mt-3 border-t border-border pt-3">
              <div className="grid grid-cols-2 gap-1">
                {futureLinks.map((l) => (
                  <div
                    key={l.key}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground"
                  >
                    <l.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t(l.key)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-center">
                <LanguageToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
