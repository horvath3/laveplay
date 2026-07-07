import type { ReactNode } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { NavBar } from "./NavBar";
import { PageTransition } from "./PageTransition";
import { useI18n } from "@/lib/i18n";

export function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="relative flex min-h-screen flex-col">
      <AnimatedBackground />
      <NavBar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <PageTransition>{children}</PageTransition>
      </main>
      <footer className="mx-auto w-full max-w-7xl px-6 py-8 text-center text-sm text-muted-foreground">
        {t("common.footer")}
      </footer>
    </div>
  );
}
